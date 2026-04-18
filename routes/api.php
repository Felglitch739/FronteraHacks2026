<?php

use App\Http\Controllers\DailyLogController;
use App\Http\Controllers\WeeklyPlanController;
use Illuminate\Support\Facades\Route;

Route::post('weekly-plan', [WeeklyPlanController::class, 'mock'])
    ->name('api.weekly-plan.mock');

Route::post('checkin', [DailyLogController::class, 'mock'])
    ->name('api.checkin.mock');
