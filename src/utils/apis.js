import {encode as btoa} from 'base-64';
import Axios from 'axios';
import {AsyncStorage} from 'react-native';
import {_Alert} from '../components/Alert';
import {i18n} from '../translations';

// const baseurl = 'http://192.168.57.12:8080/qsystem/mobile/rest';

const baseurl = 'http://appointment.cas-mew.gov.kw:8080/qsystem/mobile/rest';

const username = 'mobile';
const password = 'Mob123456';

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic ' + btoa(username + ':' + password),
};

export const fetchServices = async () => {
  try {
    let res = await fetch(`${baseurl}/services/`, {
      method: 'GET',
      headers: headers,
    });
    let result = await res.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

export const __fetchOffices = async city => {
  try {
    const {latitude, longitude} = city;
    console.log(
      `${baseurl}/v2/branches?longitude=${longitude}&latitude=${latitude}&radius=100000000`,
    );
    let res = await fetch(
      `${baseurl}/v2/branches?longitude=${longitude}&latitude=${latitude}&radius=100000000`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    let result = await res.json();
    if (result.length > 0) {
      return result;
    } else {
      _Alert(i18n.t('Techical Problem'), 'No branches found');
      return false;
    }
  } catch (error) {
    console.log(error);
    _Alert(i18n.t('Techical Problem'), error.toString());
    return false;
  }
};

export const __waitInfo = async branchId => {
  try {
    console.log(`${baseurl}/v2/branches/${branchId}/services/wait-info`);
    let res = await fetch(
      `${baseurl}/v2/branches/${branchId}/services/wait-info`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    let result = await res.json();
    if (result.length !== 0) {
      return {
        ok: true,
        data: result[0],
      };
    } else {
      return {
        ok: false,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: error,
    };
  }
};

export const _checkForBranchLimit = async branchId => {
  try {
    let res = await fetch(`http://digimonk.co/api/ticket.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({branch_id: branchId}),
    });
    res = await res.json();
    return res.status;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const _checkForUniqueCivilId = async civilId => {
  try {
    let res = await fetch(`http://digimonk.co/api/civil.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({civilId: civilId}),
    });
    res = await res.json();
    return res.status;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const _createTicketWithoutTime = async data => {
  try {
    const {branchId, civilId} = data;
    let checkForCivilId = true;
    const checkForBranchId = await _checkForBranchLimit(branchId);
    if (checkForBranchId) {
      checkForCivilId = await _checkForUniqueCivilId(civilId);
    }
    if (checkForCivilId && checkForBranchId) {
      console.log(
        `${baseurl}/services/18/branches/${branchId}/ticket/issue?delay=0&civilId=${civilId}`,
      );
      let res = await Axios.post(
        `${baseurl}/services/18/branches/${branchId}/ticket/issue?delay=0&civilId=${civilId}`,
        {},
        {headers: headers},
      );
      const {status} = res;
      if (status === 200) {
        return {ok: true, data: res.data};
      } else {
        return {ok: false, message: 'Service Unavailable'};
      }
    } else {
      if (checkForCivilId === false) {
        return {
          ok: false,
          message: 'One Ticket',
        };
      } else {
        return {
          ok: false,
          message: 'Branch Limit',
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'There Is Some Technical Error',
      error: error,
    };
  }
};

export const _createTicketWithTime = async data => {
  try {
    const {branchId, civilId, delay} = data;
    let checkForCivilId = true;
    const checkForBranchId = await _checkForBranchLimit(branchId);
    if (checkForBranchId) {
      checkForCivilId = await _checkForUniqueCivilId(civilId);
    }
    if (checkForCivilId && checkForBranchId) {
      console.log(delay);
      console.log(
        `${baseurl}/services/18/branches/${branchId}/ticket/issue?delay=${delay}&civilId=${civilId}`,
      );
      let res = await Axios.post(
        `${baseurl}/services/18/branches/${branchId}/ticket/issue?delay=${delay}&civilId=${civilId}`,
        {},
        {headers: headers},
      );
      const {status} = res;
      if (status === 200) {
        return {ok: true, data: res.data};
      } else {
        return {ok: false, message: 'Service Unavailable'};
      }
    } else {
      if (checkForCivilId === false) {
        return {
          ok: false,
          message: 'One Ticket',
        };
      } else {
        return {
          ok: false,
          message: 'Branch Limit',
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'There Is Some Technical Error',
      error: error,
    };
  }
};

// let global_data_1;
// let global_data_2;

// const checkForUniqueCivilId = async (civilId) => {
//   try {
//     let data = await AsyncStorage.getItem("data");
//     if (data === null) {
//       let date = new Date();
//       date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
//       data = { civilIds: [civilId], date: date };
//       //await AsyncStorage.setItem("data", JSON.stringify(data));
//       global_data_1 = data;
//       return true;
//     } else {
//       data = JSON.parse(data);
//       if (data.civilIds.indexOf(civilId) !== -1) {
//         return false;
//       } else {
//         data = { ...data, civilIds: [...data.civilIds, civilId] };
//         //await AsyncStorage.setItem("data", JSON.stringify(data));
//         global_data_1 = data;
//         return true;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };

// export const refreshDataForCivilId = async () => {
//   try {
//     //await AsyncStorage.removeItem("data"); // for testing purposes
//     let data = await AsyncStorage.getItem("data");
//     if (data === null) {
//       return true;
//     } else {
//       data = JSON.parse(data);
//       let presentDate = new Date();
//       presentDate = `${presentDate.getDate()}-${presentDate.getMonth()}-${presentDate.getFullYear()}`;
//       // presentDate = "16-06-2020";  // For Testing Purposes
//       if (data.date === presentDate) {
//         return true;
//       } else {
//         await AsyncStorage.removeItem("data");
//         return true;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return true;
//   }
// };

// export const refreshDataForBranchId = async () => {
//   try {
//     //await AsyncStorage.removeItem("data"); // for testing purposes
//     let data_1 = await AsyncStorage.getItem("data_1");
//     if (data_1 === null) {
//       return true;
//     } else {
//       data_1 = JSON.parse(data_1);
//       let presentDate = new Date();
//       presentDate = `${presentDate.getDate()}-${presentDate.getMonth()}-${presentDate.getFullYear()}`;
//       //presentDate = "16-06-2020"; // For Testing Purposes
//       if (data_1.date === presentDate) {
//         return true;
//       } else {
//         await AsyncStorage.removeItem("data_1");
//         return true;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return true;
//   }
// };

// // export const _createTicketWithoutTime = async (data) => {
// //   try {
// //     const { branchId, civilId } = data;
// //     const checkForCivilId = await checkForUniqueCivilId(civilId);
// //     await _checkForBranchLimit(branchId);
// //     if (checkForCivilId) {
// //       console.log(
// //         `${baseurl}/services/18/branches/${branchId}/ticket/issue?delay=0&civilId=${civilId}`
// //       );
// //       let res = await Axios.post(
// //         `${baseurl}/services/18/branches/${branchId}/ticket/issue?delay=0&civilId=${civilId}`,
// //         {},
// //         { headers: headers }
// //       );
// //       const { status } = res;
// //       if (status === 200) {
// //         return { ok: true, data: res.data };
// //       } else {
// //         return { ok: false, message: "Service Unavailable" };
// //       }
// //     } else {
// //       return {
// //         ok: false,
// //         message: "One Ticket",
// //       };
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     return { ok: false, message: "There Is Some Technical Error" };
// //   }
// // };

// export const _localCheckForBranchLimit = async (branch_id) => {
//   try {
//     let data_1 = await AsyncStorage.getItem("data_1");
//     if (data_1 === null) {
//       let date = new Date();
//       date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
//       data_1 = { branches: [{ branchId: branch_id, count: 1 }], date: date };
//       //await AsyncStorage.setItem("data_1", JSON.stringify(data_1));
//       global_data_2 = data_1;
//       return true;
//     } else {
//       data_1 = JSON.parse(data_1);
//       let targetIndex = data_1.branches.findIndex(
//         (item) => item.branchId === branch_id
//       );
//       if (targetIndex !== -1) {
//         if (data_1.branches[targetIndex].count === 50) {
//           return false;
//         } else {
//           let branches = data_1.branches.map((a, i) => {
//             var returnValue = { ...a };
//             if (i === targetIndex) {
//               returnValue.count = returnValue.count + 1;
//             }
//             return returnValue;
//           });
//           data_1 = { ...data_1, branches: branches };
//           //await AsyncStorage.setItem("data_1", JSON.stringify(data_1));
//           global_data_2 = data_1;
//           return true;
//         }
//       } else {
//         data_1 = {
//           ...data_1,
//           branches: [...data_1.branches, { branchId: branch_id, count: 1 }],
//         };
//         //await AsyncStorage.setItem("data_1", JSON.stringify(data_1));
//         global_data_2 = data_1;
//         return true;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };

// const commitTransaction = async () => {
//   try {
//     await AsyncStorage.setItem("data_1", JSON.stringify(global_data_2));
//     await AsyncStorage.setItem("data", JSON.stringify(global_data_1));
//   } catch (error) {
//     console.log(error);
//   }
// };
