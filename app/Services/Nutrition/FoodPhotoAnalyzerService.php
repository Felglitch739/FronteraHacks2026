<?php

namespace App\Services\Nutrition;

use App\Services\Ai\OpenAiClientService;
use RuntimeException;

class FoodPhotoAnalyzerService
{
    private const MAX_IMAGE_DIMENSION = 1024;
    private const JPEG_QUALITY = 68;

    public function __construct(
        private readonly OpenAiClientService $openAiClient,
        private readonly \App\Services\Ai\PromptTemplateService $promptTemplateService,
    ) {
    }

    public function analyzeFromImage(string $absoluteImagePath, ?string $mealLabel = null): array
    {
        if (!is_file($absoluteImagePath)) {
            throw new RuntimeException('Food image file does not exist.');
        }

        [$binary, $mime] = $this->optimizedImagePayload($absoluteImagePath);

        if ($binary === false) {
            throw new RuntimeException('Could not read food image file.');
        }

        $dataUrl = sprintf('data:%s;base64,%s', $mime, base64_encode($binary));

        $systemPrompt = $this->promptTemplateService->load('ai/food-photo.system.txt');

        $textPrompt = $this->promptTemplateService->render('ai/food-photo.user.txt', [
            'meal_label' => $mealLabel ? trim($mealLabel) : 'unknown',
        ]);

        $payload = $this->openAiClient->chatJsonWithImage($systemPrompt, $textPrompt, $dataUrl);

        return $this->normalize($payload, $mealLabel);
    }

    /**
     * @return array{0: string|false, 1: string}
     */
    private function optimizedImagePayload(string $absoluteImagePath): array
    {
        $binary = file_get_contents($absoluteImagePath);
        $mime = mime_content_type($absoluteImagePath);

        if (!is_string($mime) || $mime === '') {
            $mime = 'image/jpeg';
        }

        if (!extension_loaded('gd')) {
            return [$binary, $mime];
        }

        $imageInfo = @getimagesize($absoluteImagePath);

        if (!is_array($imageInfo) || !isset($imageInfo[0], $imageInfo[1])) {
            return [$binary, $mime];
        }

        [$width, $height] = $imageInfo;
        $maxDimension = max($width, $height);

        if ($maxDimension <= self::MAX_IMAGE_DIMENSION && $mime === 'image/jpeg') {
            return [$binary, $mime];
        }

        $source = match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($absoluteImagePath),
            'image/png' => @imagecreatefrompng($absoluteImagePath),
            'image/webp' => function_exists('imagecreatefromwebp')
            ? @imagecreatefromwebp($absoluteImagePath)
            : false,
            default => false,
        };

        if ($source === false) {
            return [$binary, $mime];
        }

        $scale = min(1, self::MAX_IMAGE_DIMENSION / $maxDimension);
        $targetWidth = max(1, (int) round($width * $scale));
        $targetHeight = max(1, (int) round($height * $scale));

        $resized = imagecreatetruecolor($targetWidth, $targetHeight);

        if ($resized === false) {
            imagedestroy($source);
            return [$binary, $mime];
        }

        imagecopyresampled(
            $resized,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $width,
            $height,
        );

        ob_start();
        imagejpeg($resized, null, self::JPEG_QUALITY);
        $optimizedBinary = ob_get_clean();

        imagedestroy($resized);
        imagedestroy($source);

        if (!is_string($optimizedBinary) || $optimizedBinary === '') {
            return [$binary, $mime];
        }

        return [$optimizedBinary, 'image/jpeg'];
    }

    private function normalize(array $payload, ?string $mealLabel): array
    {
        $required = [
            'mealName',
            'summary',
            'calories',
            'proteinGrams',
            'carbsGrams',
            'fatGrams',
            'recommendation',
        ];

        foreach ($required as $field) {
            if (!array_key_exists($field, $payload)) {
                throw new RuntimeException(sprintf('Food analysis is missing %s.', $field));
            }
        }

        $mealName = trim((string) $payload['mealName']);
        $summary = trim((string) $payload['summary']);
        $recommendation = trim((string) $payload['recommendation']);

        if ($mealName === '' || $summary === '' || $recommendation === '') {
            throw new RuntimeException('Food analysis contains empty required text fields.');
        }

        return [
            'mealName' => $mealName,
            'mealLabel' => $mealLabel ? trim($mealLabel) : null,
            'summary' => $summary,
            'calories' => max(0, (int) $payload['calories']),
            'proteinGrams' => max(0, (int) $payload['proteinGrams']),
            'carbsGrams' => max(0, (int) $payload['carbsGrams']),
            'fatGrams' => max(0, (int) $payload['fatGrams']),
            'fiberGrams' => isset($payload['fiberGrams']) ? max(0, (int) $payload['fiberGrams']) : null,
            'sugarGrams' => isset($payload['sugarGrams']) ? max(0, (int) $payload['sugarGrams']) : null,
            'sodiumMg' => isset($payload['sodiumMg']) ? max(0, (int) $payload['sodiumMg']) : null,
            'recommendation' => $recommendation,
            'detectedItems' => $this->normalizeStringList($payload['detectedItems'] ?? []),
            'confidence' => isset($payload['confidence']) ? max(0, min(100, (int) $payload['confidence'])) : null,
        ];
    }

    /**
     * @return array<int, string>
     */
    private function normalizeStringList(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        $clean = [];

        foreach ($value as $item) {
            if (!is_string($item) || trim($item) === '') {
                continue;
            }

            $clean[] = trim($item);
        }

        return array_values(array_slice($clean, 0, 8));
    }
}
