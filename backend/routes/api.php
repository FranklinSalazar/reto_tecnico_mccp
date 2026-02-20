<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MessageController;


Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::post('/messages', [MessageController::class, 'store']);
Route::get('/messages', [MessageController::class, 'index']);
