<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    /**
     * Genera un resumen usando la API de Gemini (Google Generative Language).
    */
    public function generateSummary(string $content): string
    {
        try {
            $response = Http::post(
                'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' . config('services.gemini.key'),
                [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "Resume el siguiente texto en máximo 100 caracteres. No superes 100 caracteres:\n\n$content"
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.2, // más preciso
                        'maxOutputTokens' => 60
                    ]
                ]
            );

            Log::info('Body Gemini: ' . $response->body());

            if (!$response->successful()) {
                throw new \Exception('Error en Gemini: ' . $response->body());
            }

            $json = $response->json();

            if (!isset($json['candidates'][0]['content']['parts'][0]['text'])) {
                Log::error('Respuesta inesperada Gemini: ' . json_encode($json));
                throw new \Exception('Respuesta inválida de Gemini');
            }

            $summary = trim($json['candidates'][0]['content']['parts'][0]['text']);

            if ($summary === '') {
                throw new \Exception('Resumen vacío generado por IA');
            }

            return mb_substr($summary, 0, 100);

        } catch (\Exception $e) {
            Log::error('Error Gemini: ' . $e->getMessage());
            throw $e;
        }
    }
}