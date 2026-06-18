<?php

use App\Http\Controllers\ListingsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ListingsController::class, 'index'])->name('Startseite'); 

Route::middleware(['auth'])->group(function () {
    Route::get('/listings/create', [ListingsController::class, 'create'])->name('listings.create');
    Route::post('/listings', [ListingsController::class, 'store'])->name('listings.store');
    Route::get('/listings/{listing}/edit', [ListingsController::class, 'edit'])->name('listings.edit');
    Route::put('/listings/{listing}', [ListingsController::class, 'update'])->name('listings.update');
    Route::delete('/listings/{listing}', [ListingsController::class, 'destroy'])->name('listings.destroy');
});