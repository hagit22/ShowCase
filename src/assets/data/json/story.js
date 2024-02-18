const story = {
  _id: "s101",
  txt: "Best trip ever",
  imgUrl: "http://some-img", //an array for a few pictures 
  by: {
    _id: "u101",
    username: "Ulash Ulashi",
    imgUrl: "http://some-img"
  },
  loc: { // Optional
    lat: 11.11, 
    lng: 22.22,
    name: "Tel Aviv"
  },
  "createdAt": Date.now(),
  comments: [
    {
      id: "c1001",
      by: {
        _id: "u105",
        username: "Bob",
        imgUrl: "http://some-img"
      },
      txt: "good one!",
      likedBy: [ // Optional
        {
          "_id": "u105",
          "username": "Bob",
          "imgUrl": "http://some-img"
        }
      ]
    },
    {
      id: "c1002",
      by: {
        _id: "u106",
        username: "Dob",
        imgUrl: "http://some-img"
      },
      txt: "not good!",
    }
  ],
  likedBy: [
    {
      _id: "u105",
      username: "Bob",
      imgUrl: "http://some-img"
    },
    {
      _id: "u106",
      username: "Dob",
      imgUrl: "http://some-img"
    }
  ],
  tags: ["fun", "romantic"]
}

const user = {
  _id: "u101",
  username: "Muko",
  password: "mukmuk",
  fullname: "Muki Muka",
  imgUrl: "http://some-img",
  following: [
    {
      _id: "u106",
      username: "Dob",
      imgUrl: "http://some-img"
    }
  ],
  followers: [
    {
      _id: "u105",
      username: "Bob",
      imgUrl: "http://some-img"
    }
  ],
  //savedStoryIds: ["s104", "s111", "s123"] // even better - use mini-story
  bookmarkedStories: [
    {
      _id: "s104", 
      imgUrl: "http://some-img"
    },
    {
      _id: "s105", 
      imgUrl: "http://some-img"
    }
  ],
}