mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console;

// use std::{env, fs};

// use failure::Fallible;

// use headless_chrome::{protocol::page::PrintToPdfOptions, Browser};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
// extern {
//     fn alert(s: &str);
// }

#[wasm_bindgen]
pub fn greet() {
    // alert("Hello, myproject!");
    // let debug_ws_url = env::args().nth(1).expect("Must provide debug_ws_url");

    // let file_path = format!(
    //     "file://{}",
    //     env::args()
    //         .nth(2)
    //         .expect("Must provide path/to/file/index.html")
    // );

    // let browser = Browser::connect(debug_ws_url.to_string()).unwrap();
    // let tab = browser.wait_for_initial_tab().unwrap();

    // let wikidata = tab
    //     .navigate_to("https://www.wikipedia.org")
    //     .unwrap()
    //     .wait_until_navigated()
    //     .unwrap()
    //     .print_to_pdf(None)
    //     .unwrap();
    // fs::write("wiki.pdf", &wikidata).unwrap();
    // println!("PDF successfully created from internet web page.");

    // // Browse to the file url and render a pdf of the web page.
    // let pdf_options: Option<PrintToPdfOptions> = None; // use chrome's defaults for this example
    // let local_pdf = tab
    //     .navigate_to(&file_path)
    //     .unwrap()
    //     .wait_until_navigated()
    //     .unwrap()
    //     .print_to_pdf(pdf_options)
    //     .unwrap();
    // fs::write("rust.pdf", &local_pdf).unwrap();
    // println!("PDF successfully created from local web page.");

    console::log_1(&JsValue::from_str(("Hello from Rust")));
}
