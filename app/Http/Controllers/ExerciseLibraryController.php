<?php

namespace App\Http\Controllers;

use App\Services\Exercises\ExerciseDbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class ExerciseLibraryController extends Controller
{
    public function index(Request $request, ExerciseDbService $exerciseDbService): JsonResponse
    {
        $limit = $request->integer('limit', 30);

        try {
            $results = $exerciseDbService->listExercises($limit);

            return response()->json([
                'results' => $results,
                'count' => count($results),
            ]);
        } catch (RuntimeException $exception) {
            $status = $exception->getCode();
            if (!is_int($status) || $status < 400 || $status > 599) {
                $status = 500;
            }

            return response()->json([
                'message' => $exception->getMessage(),
            ], $status);
        } catch (Throwable) {
            return response()->json([
                'message' => 'Unexpected error while loading exercise library.',
            ], 500);
        }
    }
}
