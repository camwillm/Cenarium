use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone)]
pub struct Nutrition {
    pub calories: f64,
    pub protein_g: f64,
    pub fat_g: f64,
    pub carbs_g: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Item {
    pub item_id: String,
    pub name: String,
    pub store: String,
    pub unit: String,
    pub price: f64,
    pub serving_size_g: f64,
    pub nutrition: Nutrition,
    pub category: String,
    pub price_per_gram: f64,
    pub price_per_serving: f64,
    pub last_updated: String,
}

pub type ItemsByCategory = HashMap<String, Vec<Item>>;