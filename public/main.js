// let trash = document.getElementsByClassName("fa-ban");
let addComment = document.getElementsByClassName("addComment");
let thumbsDown = document.getElementsByClassName("fa-solid fa-thumbs-down");
let hearts = document.getElementsByClassName("fa-heart");
document.getElementById("button1").addEventListener("click", stockInfo);
document.getElementById("button2").addEventListener("click", cryptoInfo);

Array.from(hearts).forEach(function (element) {
  element.addEventListener("click", function () {
    console.log(this.parentNode.parentNode);
    const postId = this.parentNode.parentNode.id;
    const likes = parseFloat(
      this.parentNode.parentNode.querySelector(".heartnumber").innerText
    );

    fetch("heartPost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        heart: likes,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then(function (response) {
        window.location.reload();
      });
  });
});
Array.from(thumbsDown).forEach(function (element) {
  element.addEventListener("click", function () {
    console.log(this.parentNode.parentNode);
    const postId = this.parentNode.parentNode.id;
    const dislikes = parseFloat(
      this.parentNode.parentNode.querySelector(".downtotal").innerText
    );

    fetch("thumbsDown", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        thumbDown: dislikes,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then(function (response) {
        window.location.reload();
      });
  });
});

Array.from(addComment).forEach(function (element) {
  element.addEventListener("click", function () {
    let postId = this.parentNode.querySelector(".objectId").value;
    console.log(postId);
    let comment = this.parentNode.querySelector(".commentbox").value;
    console.log(comment);
    fetch("addComment", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: postId,
        comment: comment,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then(function (response) {
        window.location.reload();
      });
  });
});

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}

function stockInfo() {
  let stockSymbol = document.getElementById("stockSymbol").value;

  let url1 = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=5min&outputsize=compact&apikey=M8TBD0YRPNI0LRQE`;

  fetch(url1)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      console.log(data);

      let stock = data[`Meta Data`];
      let stockSymbol = stock[`2. Symbol`];
      document.getElementById("stockName").innerText = stockSymbol;
      console.log(stockSymbol);

      let date = formatDate(yesterday);
      console.log(date);

      let stockInfo = data[`Time Series (5min)`];
      console.log(stockInfo);

      let keys = Object.keys(stockInfo);
      console.log(keys[keys.length - 1]);

      let lastDate = stockInfo[keys[keys.length - 1]];
      console.log(lastDate);

      let openCost = lastDate[`1. open`];
      document.getElementById("stockOpen").innerText = openCost;
      console.log(openCost);

      let dailyHigh = lastDate[`2. high`];
      document.getElementById("stockHigh").innerText = dailyHigh;

      let dailyLow = lastDate[`3. low`];
      document.getElementById("stockLow").innerText = dailyLow;

      let dailyClose = lastDate[`4. close`];
      document.getElementById("stockClose").innerText = dailyClose;

      let dailyVolume = lastDate[`5. volume`];
      document.getElementById("stockVolume").innerText = dailyVolume;
      console.log(dailyVolume);
    })

    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function cryptoInfo() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "11768ef5dfmshd06127c1ccad9a9p119cc0jsn41acb94f82b9",
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
    },
  };
  let cryptoSymbol = document.getElementById("cryptoSymbol").value;

  let url1 = `https://alpha-vantage.p.rapidapi.com/query?market=USD&symbol=${cryptoSymbol}&function=DIGITAL_CURRENCY_DAILY`;

  fetch(url1, options)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      console.log(data);

      let crypto = data["Meta Data"];
      console.log(crypto);
      let cryptoSymbol = crypto[`3. Digital Currency Name`];
      document.getElementById("cryptoName").innerText = cryptoSymbol;
      console.log(cryptoSymbol);

      let cryptoInfo = data[`Time Series (Digital Currency Daily)`];
      console.log(cryptoInfo);

      let date = formatDate(yesterday);
      console.log(date);

      let lastDate = cryptoInfo[`${date}`];
      console.log(lastDate);

      if (lastDate === undefined) {
        lastDate = cryptoInfo[`${date}`];
        console.log(data);
      }

      let cryptoOpen = lastDate[`1a. open (USD)`];
      document.getElementById("cryptoOpen").innerText = cryptoOpen;

      let cryptoHigh = lastDate[`2a. high (USD)`];
      document.getElementById("cryptoHigh").innerText = cryptoHigh;

      let cryptoLow = lastDate[`3a. low (USD)`];
      document.getElementById("cryptoLow").innerText = cryptoLow;

      let cryptoClose = lastDate[`4a. close (USD)`];
      document.getElementById("cryptoClose").innerText = cryptoClose;

      let cryptoVolume = lastDate[`5. volume`];
      document.getElementById("cryptoVolume").innerText = cryptoVolume;
    })

    .catch((err) => {
      console.log(`error ${err}`);
    });
}
