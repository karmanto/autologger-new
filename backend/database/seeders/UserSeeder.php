<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin@simbolonphukettour.com',
            'password' => Hash::make('*Bismillah*2025'),
            'name' => 'admin',
            'token' => ''
        ]);
    }
}
