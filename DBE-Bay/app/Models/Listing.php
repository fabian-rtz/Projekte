<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
   use HasFactory, SoftDeletes;

   protected $fillable = ['customer_id','name','beschreibung','preis','category_id'];


   public function customer(){
        return $this->belongsTo(Customer::class);
   }
   public function favorites(){
        return $this->belongsToMany(Customer::class,'favorites');
   }
   public function image(){
        return $this->hasMany(ListingImage::class);
   }
   public function category(){
        return $this->belongsTo(Category::class);
   }
}
