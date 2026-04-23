<?php

namespace App\Services\Exercises;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class ExerciseDbService
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function listExercises(int $limit = 30): array
    {
        $apiKey = (string) config('services.rapidapi.key', '');
        $apiHost = (string) config('services.rapidapi.exercise_host', 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com');
        $baseUrl = (string) config('services.rapidapi.exercise_base_url', 'https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com');

        if ($apiKey === '') {
            throw new RuntimeException('RAPIDAPI_KEY is not configured.', 500);
        }

        try {
            $response = Http::baseUrl($baseUrl)
                ->timeout(20)
                ->acceptJson()
                ->withHeaders([
                    'X-RapidAPI-Key' => $apiKey,
                    'X-RapidAPI-Host' => $apiHost,
                ])
                ->get('/exercises', [
                    'limit' => max(1, min($limit, 100)),
                ]);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Unable to reach exercise provider. Please try again in a moment.', 503, $exception);
        }

        if ($response->status() === 401 || $response->status() === 403) {
            throw new RuntimeException('RapidAPI authentication failed. Verify RAPIDAPI_KEY and subscription access.', 502);
        }

        if ($response->status() === 429) {
            throw new RuntimeException('RapidAPI rate limit reached. Please retry later.', 429);
        }

        try {
            $response->throw();
        } catch (RequestException $exception) {
            throw new RuntimeException('Exercise provider request failed.', 502, $exception);
        }

        $payload = $response->json();
        $rows = $this->extractRows($payload);

        $normalized = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $mapped = $this->mapExercise($row);
            if ($mapped !== null) {
                $normalized[] = $mapped;
            }
        }

        return $normalized;
    }

    /**
     * @param mixed $payload
     * @return array<int, mixed>
     */
    private function extractRows(mixed $payload): array
    {
        if (!is_array($payload)) {
            return [];
        }

        if (isset($payload['results']) && is_array($payload['results'])) {
            return $payload['results'];
        }

        if (isset($payload['data']) && is_array($payload['data'])) {
            return $payload['data'];
        }

        if (isset($payload['exercises']) && is_array($payload['exercises'])) {
            return $payload['exercises'];
        }

        return array_is_list($payload) ? $payload : [];
    }

    /**
     * @param array<string, mixed> $exercise
     * @return array<string, mixed>|null
     */
    private function mapExercise(array $exercise): ?array
    {
        $id = $this->toStringOrNull(
            $exercise['id'] ?? $exercise['exerciseId'] ?? $exercise['exercise_id'] ?? null,
        );

        $name = $this->toStringOrNull(
            $exercise['name'] ?? $exercise['exerciseName'] ?? $exercise['exercise_name'] ?? $exercise['title'] ?? null,
        );

        if ($name === null) {
            return null;
        }

        $description = $this->normalizeDescription(
            $exercise['description'] ?? $exercise['instructions'] ?? null,
        );

        $images = $this->normalizeImageMedia($exercise);
        $videos = $this->normalizeVideoMedia($exercise);

        return [
            'id' => $id ?? strtolower(preg_replace('/\s+/', '-', trim($name)) ?? ''),
            'name' => $name,
            'description' => $description,
            'images' => $images,
            'videos' => $videos,
            'bodyPart' => $this->toStringOrNull($exercise['bodyPart'] ?? $exercise['body_part'] ?? null),
            'target' => $this->toStringOrNull($exercise['target'] ?? null),
            'equipment' => $this->toStringOrNull($exercise['equipment'] ?? null),
        ];
    }

    /**
     * @param array<string, mixed> $exercise
     * @return array<int, array{id: string, url: string, isMain: bool}>
     */
    private function normalizeImageMedia(array $exercise): array
    {
        $collection = [];

        $this->pushMediaUrls($collection, $exercise['images'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['imageUrls'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['image_urls'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['photos'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['gifUrl'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['gif_url'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['image'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['thumbnail'] ?? null, false);

        if ($collection === []) {
            return [];
        }

        $seen = [];
        $normalized = [];

        foreach ($collection as $index => $item) {
            $url = $this->toStringOrNull($item['url'] ?? null);
            if ($url === null || isset($seen[$url])) {
                continue;
            }

            $seen[$url] = true;
            $normalized[] = [
                'id' => 'img-' . ($index + 1),
                'url' => $url,
                'isMain' => $item['isMain'] ?? false,
            ];
        }

        if ($normalized !== []) {
            $normalized[0]['isMain'] = true;
        }

        return $normalized;
    }

    /**
     * @param array<string, mixed> $exercise
     * @return array<int, array{id: string, url: string, thumbnailUrl: string|null}>
     */
    private function normalizeVideoMedia(array $exercise): array
    {
        $collection = [];

        $this->pushMediaUrls($collection, $exercise['videos'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['videoUrls'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['video_urls'] ?? null, false);
        $this->pushMediaUrls($collection, $exercise['videoUrl'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['video_url'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['youtubeUrl'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['youtube_url'] ?? null, true);
        $this->pushMediaUrls($collection, $exercise['instructionsVideo'] ?? null, true);

        if ($collection === []) {
            return [];
        }

        $seen = [];
        $thumbnail = $this->toStringOrNull($exercise['thumbnail'] ?? null);
        $normalized = [];

        foreach ($collection as $index => $item) {
            $url = $this->toStringOrNull($item['url'] ?? null);
            if ($url === null || isset($seen[$url])) {
                continue;
            }

            $seen[$url] = true;
            $normalized[] = [
                'id' => 'vid-' . ($index + 1),
                'url' => $url,
                'thumbnailUrl' => $this->toStringOrNull($item['thumbnailUrl'] ?? null) ?? $thumbnail,
            ];
        }

        return $normalized;
    }

    /**
     * @param array<int, array{url: mixed, isMain?: bool, thumbnailUrl?: mixed}> $target
     */
    private function pushMediaUrls(array &$target, mixed $value, bool $isMain): void
    {
        if (is_string($value) || is_numeric($value)) {
            $target[] = ['url' => $value, 'isMain' => $isMain];

            return;
        }

        if (!is_array($value)) {
            return;
        }

        foreach ($value as $candidate) {
            if (is_string($candidate) || is_numeric($candidate)) {
                $target[] = ['url' => $candidate, 'isMain' => $isMain];

                continue;
            }

            if (!is_array($candidate)) {
                continue;
            }

            $target[] = [
                'url' => $candidate['url']
                    ?? $candidate['image']
                    ?? $candidate['video']
                    ?? $candidate['link']
                    ?? null,
                'isMain' => (bool) ($candidate['is_main'] ?? $candidate['isMain'] ?? $isMain),
                'thumbnailUrl' => $candidate['thumbnail'] ?? $candidate['thumbnailUrl'] ?? null,
            ];
        }
    }

    private function normalizeDescription(mixed $value): string
    {
        if (is_string($value)) {
            return trim($value);
        }

        if (!is_array($value)) {
            return '';
        }

        $parts = [];
        foreach ($value as $entry) {
            if (is_string($entry) && trim($entry) !== '') {
                $parts[] = trim($entry);
            }
        }

        return implode(' ', $parts);
    }

    private function toStringOrNull(mixed $value): ?string
    {
        if (!is_string($value) && !is_numeric($value)) {
            return null;
        }

        $result = trim((string) $value);

        return $result === '' ? null : $result;
    }
}
