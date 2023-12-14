<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = Image::all();
        return response()->json(['images' => $images]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImageRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $image = Image::find($id);

        if (!$image) {
            return response()->json(['message' => 'Image introuvable'], 404);
        }

        return response()->json($image);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        //
    }

//    public function ImageUpload(Request $request): \Illuminate\Http\JsonResponse
//    {
////        if ($request->hasFile('image') && $request->file('image')->isValid()) {
////            $uploadedFile = $request->file('image');
////            $uploadedFileName = $uploadedFile->getClientOriginalName();
////            $path = $uploadedFile->storeAs('public/uploads', $uploadedFileName);
////            return response()->json(["result" => $path]);
////        } else {
////            return response()->json(["error" => "No valid file uploaded"], 400);
////        }
//
////        if ($request->hasFile('image') && $request->file('image')->isValid()) {
////            $uploadedFile = $request->file('image');
////            $uploadedFileName = $uploadedFile->getClientOriginalName();
////            $path = $uploadedFile->storeAs('public/uploads', $uploadedFileName);
////
////            // Récupérez l'URL de l'image sauvegardée
////            $imageUrl = asset(Storage::url($path));
////
////            // Enregistrez $imageUrl dans votre base de données avec d'autres détails de l'image
////            Image::create([
////                'image_url' => $imageUrl,
////            ]);
////
////            return response()->json(["result" => $imageUrl]);
////        }else {
////            return response()->json(["error" => "Une erreur lors de l'upload est survenue."], 400);
////        }
//
////        if ($request->hasFile('image') && $request->file('image')->isValid()) {
////            $uploadedFile = $request->file('image');
////            $uploadedFileName = $uploadedFile->getClientOriginalName();
////
////            // Utilisation de la classe Storage pour stocker le fichier
////            $path = Storage::putFileAs('public/uploads', $uploadedFile, $uploadedFileName);
////
////            return response()->json(["result" => $path]);
////        } else {
////            return response()->json(["error" => "No valid file uploaded"], 400);
////        }
//
//        if ($request->hasFile('image') && $request->file('image')->isValid()) {
//            $uploadedFile = $request->file('image');
//            $uploadedFileName = $uploadedFile->getClientOriginalName();
//
//            // Utilisation de la classe Storage pour stocker le fichier
//            $path = Storage::putFileAs('public/uploads', $uploadedFile, $uploadedFileName);
//
//            // Obtention de l'URL complète du fichier
//            $url = Storage::url($path);
//
//            return response()->json(["result" => $url]);
//        } else {
//            return response()->json(["error" => "No valid file uploaded"], 400);
//        }
//    }
}
