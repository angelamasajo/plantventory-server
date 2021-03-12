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

function makeUserPlantsArray() {
  return [
    {
      plant_id: 1,
      user_id: 1
    }
    // {
    //   plant_name: 'Monstera Deliciosa',
    //   care_details: 'Here"s the care detail for the monstera',
    //   toxicity: 'Toxic',
    //   plant_type: 'Tropical',
    //   plant_id: 1,
    //   user_name: 'user 1',
    //   user_id: 1,
    // }
  ]
}

// function makeMaliciousUser() {
//   const maliciousUser = {
//     id: 911,
//     user_name: "bad name here",
//     user_password: 'bad pass here <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
//   };
//   const expectedUser = {
//     ...maliciousUser,
//     user_name: "bad name here",
//     user_password: 'bad pass here <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
//   };
//   return {
//     maliciousUser,
//     expectedUser,
//   };
// }


module.exports = {
  makeUsersArray,
  // makeMaliciousUser,
  makeUserPlantsArray
};
