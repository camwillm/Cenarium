use axum::Json;
use std::fs;
use crate::models::ItemsByCategory;

pub async fn get_items() -> Json<ItemsByCategory> {
    let data = fs::read_to_string("../fetching-scripts/all-items.json").unwrap();
    let items: ItemsByCategory = serde_json::from_str(&data).unwrap();
    Json(items)
}