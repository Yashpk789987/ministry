import { cities } from "../../assets/data/cities";

const key = "AIzaSyBFffBBAkxKlHcYqWafNgQwmD-pH4JMizk";

export const getLatAndLong = async (address) => {
  try {
    console.log(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        key
    );
    let response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        key
    );
    response = await response.json(response);
    if (response.status === "OK") {
      return response.results[0].geometry.location;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error::geocode" + error);
    return false;
  }
};

// for(let i = 0 ; i < cities.length ; i++){
//   console.log(
//     "https://maps.googleapis.com/maps/api/geocode/json?address=" +
//       cities[i].en +
//       "&key=" +
//       key
//   );
//   let response = await fetch(
//     "https://maps.googleapis.com/maps/api/geocode/json?address=" +
//     cities[i].en +
//       "&key=" +
//       key
//   );
//   response = await response.json(response);
//   if (response.status === "OK") {
//     let {lat,lng} = response.results[0].geometry.location
//     cities[i] = {...cities[i] , latitude : lat , longitude : lng};
//     console.log(cities[i])
//   } else {

//   }
// }
