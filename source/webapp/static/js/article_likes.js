const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

async function makeRequest(url, method="POST") {
    let response = await fetch(url, {
        method: method,
        headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json"
        }
    });

    if(response.ok){
        return await response.json();
    } else {
        let error = new Error(await response.text());
        console.error(error);
        throw error;
    }
}


async function toggleLike(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const isLiked = button.dataset.isLiked === "true";
    const objectId = button.dataset.articleId || button.dataset.commentId;
    const isArticle = button.hasAttribute('data-article-id');
    const url = isArticle ? `/article/${objectId}/like/` : `/comment/${objectId}/like/`;
    const method = isLiked ? "DELETE" : "POST";

    try {
        const data = await makeRequest(url, method);
        updateLikeButton(button, !isLiked, data.likes_count);
    } catch (error) {
        console.error("Failed to toggle like:", error);
    }
}


function updateLikeButton(button, liked, likesCount) {
    const icon = button.querySelector('i');
    icon.className = liked ? 'bi bi-heart-fill' : 'bi bi-heart';
    button.dataset.isLiked = liked ? "true" : "false";
    button.nextElementSibling.textContent = likesCount;
}

function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.article-like-button, .comment-like-button');
    likeButtons.forEach(button => button.addEventListener('click', toggleLike));
}

document.addEventListener('DOMContentLoaded', initLikeButtons);
