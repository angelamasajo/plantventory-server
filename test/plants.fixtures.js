function makePlantsArray() {
  return [
    {
      id: 1,
      name: "Monstera Deliciosa",
      plant_type: "Tropical",
      toxicity: "Toxic",
      care_details: 'Here"s the care detail for the monstera',
    },
    {
      id: 2,
      name: "Monstera Adansonii",
      plant_type: "Tropical",
      toxicity: "Toxic",
      care_details: 'Here"s the care detail for the monstera adansonii',
    },
    {
      id: 3,
      name: "Christmas Cactus",
      plant_type: "Holiday",
      toxicity: "Pet-safe",
      care_details: 'Here"s the care detail for the christmas cactus',
    },
    {
      id: 4,
      name: "Golden Pothos",
      plant_type: "Trailing",
      toxicity: "Toxic",
      care_details: 'Here"s the care detail for the golden pothos',
    },
    {
      id: 5,
      name: "Zamioculcas Zamiifolia",
      plant_type: "Other",
      toxicity: "Toxic",
      care_details: 'Here"s the care detail for the ZZ plant',
    },
    {
      id: 7,
      name: "Calethea White Fusion",
      plant_type: "Tropical",
      toxicity: "Pet-safe",
      care_details: 'Here"s the care detail for the calethea white fusion',
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
  makePlantsArray,
};
