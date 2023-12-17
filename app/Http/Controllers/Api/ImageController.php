<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Http\Resources\ImageResource;
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
        $validatedData = $request->validated();

        $uploadedFile = $request->file('image');
        $uploadedFileName = time() . '_' . $uploadedFile->getClientOriginalName();

       // Enregistrer l'image dans le stockage public
        $path = $uploadedFile->storeAs('public/uploads', $uploadedFileName);

        // Créer une entrée dans la table 'images'
        $image = Image::create([
            'url' => Storage::url($path), // Récupérer l'URL pour afficher l'image
            'image_path' => $path, // Stocker le chemin relatif
        ]);

        return response()->json(['image' => $image], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        return new ImageResource($image);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, $id)
    {

        //Je valide la requête
        $imageRequest = $request->validated();

        $uploadImage = $request->file('image');
        //On crée le nom du fichier
        $uploadImageName = time().'_'.$uploadImage->getClientOriginalName();

        // Enregistrer l'image dans le stockage public
        $pathImage = $uploadImage->storeAs('public/uploads', $uploadImageName);

        //Récupérer l'image par rapport à l'id
        $image = Image::findOrFail($id);

        //Mettre à jour les informations de l'image existante avec les nouvelles données
        $image->url = Storage::url($pathImage);
        $image->image_path = $pathImage;

        // Sauvegarder les modifications
        $image->save();
        //response
        return response()->json(['image' => $image], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        //
    }

}
