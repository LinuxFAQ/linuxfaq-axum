// use tokio::io;

use axum::{Router, response::{IntoResponse, Response}, routing::get, extract::Path, http::{StatusCode, header, HeaderValue}, body::{self, Empty, Full}};

use std::{net::SocketAddr};

use include_dir::{Dir, include_dir};

// use git2::Repository;

//use tower_http::services::ServeFile;

//use tower::ServiceExt;

#[cfg(debug_assertions)]
fn get_server_addr() -> SocketAddr {
    SocketAddr::from(([127, 0, 0, 1], 3000))
}

#[cfg(not(debug_assertions))]
fn get_server_addr() -> SocketAddr {
    SocketAddr::from(([0, 0, 0, 0], 80))
}

// fn fetch_git_repo(repo: Repository) -> Result<(), git2::Error> {
//     repo.find_remote("origin")?.fetch(&["main"], None, None)
// }

#[tokio::main]
async fn main() {
//    let cargo_manifest_dir: String = std::env::var("CARGO_MANIFEST_DIR").unwrap();

//    let _repo = PathBuf::from(cargo_manifest_dir).join("linuxfaq").to_owned();

  //  let repo: Repository = match _repo.exists() {
   //     true => {
    //        Repository::open(_repo).expect("Failed to open the existing repository")
     //   },
      //  false => {
       //     Repository::clone("https://github.com/LinuxFAQ/linuxfaq", _repo).expect("Failed to clone the repository")
        //}
    //};

    //fetch_git_repo(repo).unwrap();

    let app = Router::new()
        .route("/", get(handle_static))
        .route("/*path", get(handle_static))
//        .route("/search", get(handle_search))
        .route("/faq/:file", get(handle_result))
        .fallback(handle_fallback);

    let addr = get_server_addr();

    println!("Listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

/// Send static files
pub async fn handle_static(path: Option<Path<String>>) -> impl IntoResponse {
    static STATIC_DIR: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/public_html");

    let path = path.unwrap_or(Path(String::from("index.html"))).trim_start_matches('/').to_string();

    println!("{}", path);

    let mime_type = mime_guess::from_path(path.clone()).first_or_text_plain();

    match STATIC_DIR.get_file(path.clone()) {
        None => {
            Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(body::boxed(Empty::new()))
            .unwrap()
        },
        Some(file) => Response::builder()
            .status(StatusCode::OK)
            .header(
                header::CONTENT_TYPE,
                HeaderValue::from_str(mime_type.as_ref()).unwrap(),
            )
            .body(body::boxed(Full::from(file.contents())))
            .unwrap(),
    }
}

/// Handle search queries, reply with a list of up to 10 search results as JSON
// pub async fn handle_search() {

// }

/// Take the requested search result and reply with the result data (cached)
pub async fn handle_result(_md: String) -> impl IntoResponse {
//    let cargo_manifest_dir: String = std::env::var("CARGO_MANIFEST_DIR").unwrap();
//
 //   let _file = PathBuf::from(cargo_manifest_dir).join("linuxfaq").join(md).to_owned();
//
 //   if _file.exists() {
  //      let response = Response::from(match ServeFile::new(_file).oneshot(request)).await {
//
 //       }
  //  } else {
        
   // }
   (StatusCode::OK, "{\"contents\":\"# Test\\n\\nThis is just a test\"}")
}

pub async fn handle_fallback() -> impl IntoResponse {
    (StatusCode::BAD_REQUEST, "Something went wrong and the resource you requested could not be provided.")
}
