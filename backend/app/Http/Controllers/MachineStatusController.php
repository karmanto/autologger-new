<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class MachineStatusController extends Controller
{
    public function index()
    {
        $filePath = storage_path('app/public/data/machine_status.json');

        if (!file_exists($filePath)) {
            return Response::json(['error' => 'Machine status data not found.'], 404);
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        if ($data === null) {
            return Response::json(['error' => 'Failed to parse machine status data.'], 500);
        }

        return Response::json($data);
    }
}
?>
