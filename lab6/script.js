// Counters
let likes = 0;
let dislikes = 0;
let comments = [];

// Elements
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const likeCount = document.getElementById("likeCount");
const dislikeCount = document.getElementById("dislikeCount");
const commentInput = document.getElementById("commentInput");
const commentBtn = document.getElementById("commentBtn");
const commentsList = document.getElementById("commentsList");
const resetBtn = document.getElementById("resetBtn");

// ---------- Cookie Functions ----------
function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";
}

function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let c of cookies) {
        let [key, val] = c.split("=");
        if (key === name) return val;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// ---------- Load Data ----------
function loadData() {
    likes = parseInt(getCookie("likes")) || 0;
    dislikes = parseInt(getCookie("dislikes")) || 0;

    let savedComments = getCookie("comments");
    if (savedComments) {
        comments = JSON.parse(savedComments);
    }

    updateUI();
}

// ---------- Update UI ----------
function updateUI() {
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;

    commentsList.innerHTML = "";
    comments.forEach(c => {
        let li = document.createElement("li");
        li.textContent = c;
        commentsList.appendChild(li);
    });
}

// ---------- Like ----------
likeBtn.onclick = () => {
    if (getCookie("voted")) {
        alert("You already voted!");
        return;
    }

    likes++;
    setCookie("likes", likes);
    setCookie("voted", "like");

    updateUI();
};

// ---------- Dislike ----------
dislikeBtn.onclick = () => {
    if (getCookie("voted")) {
        alert("You already voted!");
        return;
    }

    dislikes++;
    setCookie("dislikes", dislikes);
    setCookie("voted", "dislike");

    updateUI();
};

// ---------- Comment ----------
commentBtn.onclick = () => {
    if (getCookie("commented")) {
        alert("You already commented!");
        return;
    }

    let text = commentInput.value.trim();
    if (text === "") return;

    comments.push(text);
    setCookie("comments", JSON.stringify(comments));
    setCookie("commented", "yes");

    commentInput.value = "";
    updateUI();
};

// ---------- Reset ----------
resetBtn.onclick = () => {
    deleteCookie("likes");
    deleteCookie("dislikes");
    deleteCookie("voted");
    deleteCookie("comments");
    deleteCookie("commented");

    likes = 0;
    dislikes = 0;
    comments = [];

    updateUI();

    alert("Reset Done! You can vote again.");
};


loadData();