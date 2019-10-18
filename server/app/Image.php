<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Space;

class Image extends Model
{
    protected $fillable = ['space_id', 'filename'];
    public function space()
    {
        return $this->belongsTo(Space::class);
    }

    public function storeImage($id,UploadFile $file) 
    {
    
    }
}
