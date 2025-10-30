<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MachineDefsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(storage_path('app/data/machine_defs.json'));
        $data = json_decode($json, true);

        if (isset($data['data']) && is_array($data['data'])) {
            foreach ($data['data'] as $machine) {
                DB::table('machine_defs')->insert([
                    'name' => $machine['name'],
                    'desc' => $machine['desc'],
                    'status' => $machine['status'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
