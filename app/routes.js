module.exports = function (app, passport, db, multer, ObjectId) {
  // Image Upload Code =========================================================================
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
  });
  var upload = multer({ storage: storage });

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("login.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("posts")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          posts: result,
        });
      });
  });
  app.get("/investment", isLoggedIn, function (req, res) {
    let user = req.user._id;
    db.collection("investments")
      .find({ postedBy: user })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("investment.ejs", {
          postedBy: user,
          user: req.user,
          typepost: req.typepost,
          bio: req.bio,
          invest: req.invest,
          platform: req.platform,
          recommendations: req.recommendations,
          links: req.links,
          quotes: req.quotes,
          otherinfo: req.otherinfo,
          investing: result,
        });
      });
  });

  app.post("/investingideas", (req, res) => {
    let user = req.user._id;
    db.collection("investments").insertOne(
      {
        postedBy: user,
        invest: req.body.invest,
        msg: req.body.msg,
        typepost: req.body.typepost,
        total: req.body.total,
        sold: req.body.sold,
        strategy: req.body.strategy,
        time: req.body.time,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/investment");
      }
    );
  });

  app.get("/about", isLoggedIn, function (req, res) {
    let user = req.user._id;
    db.collection("about")
      .find({ postedBy: user })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("about.ejs", {
          postedBy: user,
          user: req.user,
          bio: req.bio,
          invest: req.invest,
          msg: req.msg,
          typepost: req.typepost,
          total: req.total,
          sold: req.sold,
          strategy: req.strategy,
          time: req.time,
          img: req.img,
          about: result,
        });
      });
  });
  app.get("/bio", isLoggedIn, function (req, res) {
    let user = req.user._id;
    db.collection("about")
      .find({ postedBy: user })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("about.ejs", {
          user: req.user,
          about: result,
        });
      });
  });

  app.post("/bio", upload.single("file-to-upload"), (req, res) => {
    let user = req.user._id;
    db.collection("about").save(
      {
        postedBy: user,
        img: "images/uploads/" + req.file.filename,
        bio: req.body.bio,
        typepost: req.body.typepost,
        invest: req.body.invest,
        platform: req.body.platform,
        recommendations: req.body.recommendations,
        links: req.body.links,
        quotes: req.body.quotes,
        otherinfo: req.body.otherinfo,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/about");
      }
    );
  });

  app.post("/savedToDatabase", (req, res) => {
    db.collection("about").insertOne(
      {
        bookName: req.body.bookName,
        url: req.body.url,
        liked: false,
        hated: false,
      },

      (err, result) => {
        if (err) return console.log(err);

        console.log("saved to database");
        res.redirect("/about");
      }
    );
  });

  //post page
  app.get("/post/:id", isLoggedIn, function (req, res) {
    let postId = ObjectId(req.params.id);
    console.log(postId);
    db.collection("posts")
      .find({ _id: postId })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("post.ejs", {
          posts: result,
        });
      });
  });
  app.post("/search", isLoggedIn, function (req, res) {
    let userName = req.body.searchUser;
    console.log(userName);
    db.collection("users")
      .find({ "local.email": userName })
      .toArray((err, result) => {
        console.log(result);
        let userId = result[0]._id;
        db.collection("about")
          .find({ postedBy: userId })
          .toArray((err, about) => {
            console.log(about);
            if (err) return console.log(err);
            res.render("about.ejs", {
              user: req.user,
              userName: result[0].local.email,
              about: about,
            });
          });
      });
  });
  //profile page
  app.get("/page/:id", isLoggedIn, function (req, res) {
    let postId = ObjectId(req.params.id);
    db.collection("posts")
      .find({ postedBy: postId })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("page.ejs", {
          posts: result,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  // post routes
  app.post("/makePost", (req, res) => {
    let user = req.user._id;
    db.collection("posts").save(
      {
        postedBy: user,
        typepost: req.body.typepost,
        name: req.body.name,
        msg: req.body.msg,
        invest: req.body.invest,
        heart: 0,
        thumbDown: 0,
        comment: [],
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });
  app.post("/makePost2", upload.single("file-to-upload"), (req, res) => {
    let user = req.user._id;
    db.collection("posts").save(
      {
        img: "images/uploads/" + req.file.filename,
        postedBy: user,
        typepost: req.body.typepost,
        name: req.body.name,
        msg: req.body.msg,
        invest: req.body.invest,
        heart: 0,
        thumbDown: 0,
        comment: [],
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile");
      }
    );
  });

  app.put("/heartPost", (req, res) => {
    const postId = ObjectId(req.body.postId);
    console.log(postId);
    console.log(req.body.heart);
    db.collection("posts").findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $set: {
          heart: req.body.heart + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.put("/thumbsDown", (req, res) => {
    const postId = ObjectId(req.body.postId);
    db.collection("posts").findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $set: {
          thumbDown: req.body.thumbDown + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
  app.put("/addComment", (req, res) => {
    const postId = ObjectId(req.body.postId);
    db.collection("posts").findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: { comment: [req.user.local.email, req.body.comment] },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  // message board routes ===============================================================

  app.delete("/messages", (req, res) => {
    db.collection("messages").findOneAndDelete(
      { name: req.body.name, msg: req.body.msg },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
