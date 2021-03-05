function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "user 1",
      user_password: "password 1",
    },
    {
      id: 2,
      user_name: "user 2",
      user_password: "password 2",
    },
    {
      id: 3,
      user_name: "user 3",
      user_password: "password 3",
    },
  ];
}

// function makeMaliciousArticle() {
//   const maliciousArticle = {
//     id: 911,
//     style: "How-to",
//     date_published: new Date().toISOString(),
//     title: 'Naughty naughty very naughty <script>alert("xss");</script>',
//     content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
//   };
//   const expectedArticle = {
//     ...maliciousArticle,
//     title:
//       'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//     content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
//   };
//   return {
//     maliciousArticle,
//     expectedArticle,
//   };
// }

module.exports = {
  makeUsersArray,
};
