import { format } from "@nodes/date-fns";
import { es } from "@nodes/date-fns/locale";
import uuid from "@nodes/react-uuid";
import { localStorageToken } from "@/config";

export function printDate(date, formatStr = "dd-MMM-yy") {
  if (!date) return "Ninguno Aun";
  return format(date, formatStr, { locale: es });
}

export function spanishErrors(error) {
  let $arr = [];
  $arr["Network Error"] = "Error Conexion de Internet!";
  $arr["timeout of 30000ms exceeded"] = "Tiempo de espera de 30 segundos excedido!";
  $arr["timeout of 60000ms exceeded"] = "Tiempo de espera de 60 segundos excedido!";
  $arr["timeout of 90000ms exceeded"] = "Tiempo de espera de 90 segundos excedido!";

  return $arr[error] ? $arr[error] : error;
}

export function getLocalToken() {
  let token = localStorage.getItem(localStorageToken);
  if (!token) {
    token = Date.now() + Math.random().toString(36).replace(".", "");
    localStorage.setItem(localStorageToken, token);
  }
  return token;
}

// parse a date in yyyy-mm-dd format
export function newDate(input) {
  if (input === "1970-01-01") return null;
  if (!input) return console.log("Input date not set!");
  if (input.length !== 10) return console.log(`wrong input provided for newDate ${input}`);
  let parts = input.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function printAbsAmount(amount, sign = "$") {
  const pieces = parseFloat(Math.abs(amount)).toFixed(0).split("");
  let ii = pieces.length - 0;
  while ((ii -= 3) > 0) {
    pieces.splice(ii, 0, ",");
  }
  return sign + pieces.join("");
}

export function getFormattedLoanContract(rawData, htmlContract = false) {
  let template =
    "Yo, %debtor_name%, mayor de edad con la cedula de identidad No. %debtor_cedula%. Al firmar este contrato renucio a cualquier derecho que pudiera tener en caso de incumplir el acuerdo de pago establecido por la empresa %route_name%, por lo que acepto pagar la totalidad del monto prestado de %loan_amount% mas los intereses, mora y gastos legales que pudieran producirse en caso de incumplimiento del presente contrato en el dia de hoy %given_date%.";

  const data = {
    "%debtor_name%": rawData.name,
    "%loan_amount%": printAmount(rawData.amount),
    "%debtor_cedula%": formatCedula(rawData.cedula) || "000-0000000-0",
    "%route_name%": rawData.route_name,
    "%given_date%": printDate(newDate(rawData.given_date)),
  };

  if (htmlContract) {
    return replaceArgumentsWithHtml(template, data);
  } else {
    return replaceArguments(template, data);
  }
}

export function replaceArguments(data = "", replacements = {}) {
  return data.replace(/%\w+%/g, function (all) {
    return all in replacements ? replacements[all] : "";
  });
}

export function replaceArgumentsWithHtml(str, data, tag = "b") {
  return str.replace(/%\w+%/g, function (all) {
    return all in data ? `<${tag}>` + data[all] + `</${tag}>` : all;
  });
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function getLocalData(key) {
  try {
    const jsonValue = localStorage.getItem(key);
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;

    return data;
  } catch (e) {
    return null;
  }
}

// export const asyncLocalStorage = {
//   setItem: async function (key, value) {
//     await null;
//     try {
//       const jsonValue = JSON.stringify(value);
//       localStorage.setItem(key, jsonValue);
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   getItem: async function (key) {
//     await null;
//     try {
//       const jsonValue = localStorage.getItem(key);
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (err) {
//       console.log("AppWorkflow - getLocalData from dataContext - catch Error");
//       console.log(err);
//     }
//   },
// };

export function getUniqueID(dataType = null) {
  const str = dataType ? dataType + "_" + uuid() : uuid();
  return str.split("-").join("");
}

export function searchArray(array, searchText = "", max = 15) {
  let filtered = array;

  filtered = filtered.filter((m) => RemoveAccents(m.name).toUpperCase().indexOf(searchText.toUpperCase()) >= 0);
  return filtered.slice(0, max);
}

export function newSearchArray(array, searchText = "", max = 15) {
  //This function was dupex because i need to search for loanSearch prop but the first function was already search for name prop.
  let filtered = array;

  const newSearch = indentifySearchType(searchText);

  filtered = filtered.filter((m) => RemoveAccents(m.loanSearch).toUpperCase().indexOf(newSearch.toUpperCase()) >= 0);
  return filtered.slice(0, max);
}

export function replaceNonDigits(str) {
  if (!str) return "";
  return str.replace(/\D/g, "");
}

export function indentifySearchType(search) {
  const newSearch = replaceNonDigits(search);

  if (newSearch.length > 4) {
    return newSearch;
  }
  return RemoveAccents(search);
}

export function sortArrayObjs(arr, prop1, prop2) {
  let sort1 = [...arr].sort(function (a, b) {
    if (a[prop1] === b[prop1]) {
      if (a[prop2] === b[prop2]) return 0;
      return a[prop2] < b[prop2] ? -1 : 1;
    } else {
      return a[prop1] < b[prop1] ? -1 : 1;
    }
  });
  return sort1;
}

export function sortArrayObjs2(arr, prop1, prop2) {
  let sort1 = [...arr].sort(function (a, b) {
    if (+a[prop1] === +b[prop1]) {
      if (+a[prop2] === +b[prop2]) return 0;
      return +a[prop2] < +b[prop2] ? -1 : 1;
    } else {
      return +a[prop1] < +b[prop1] ? -1 : 1;
    }
  });
  return sort1;
}

export function getApplyPaymentsProp(data, loan, common, payment_id) {
  const timestamp = getTimestamp();
  const uniqueDate = timestamp + loan.money_id;
  const pUniqueId = timestamp + loan.money_id;

  const paymentMora = +data.paymentMora;
  const paymentAmount = +data.paymentAmount - paymentMora;

  const completed = calcNewCompleted(loan, paymentAmount);
  const last_date = printDate(new Date(), "Y-MM-dd");

  const collected = {
    payment_id,
    pUniqueId,
    uniqueDate,
    completed,
    paymentAmount,
    previousAmount: loan.paymentAmount,
    paymentMora,
    name: loan.name,
    paymentType: data.paymentType,
    money_id: loan.money_id,
    debtor_id: loan.debtor_id,
    balance: loan.balance - paymentAmount,
    payoffLoanId: data.payoffLoanId,
    time: printDate(new Date(), "dd-MMM-yy - hh:mm:ss aaa"),
    last_date,
  };

  const applyLoan = {
    money_id: loan.money_id,
    paymentMora,
    paymentAmount,
    last_date,
  };

  const postData = {
    sleepDelay: data.sleepDelay ? true : undefined,
    name: loan.name,
    creditor_id: data.creditor_id,
    user_id: data.user_id,
    paymentType: data.paymentType,
    money_id: loan.money_id,
    debtor_id: loan.debtor_id,
    payment_date: data.payment_date,
    paymentAmount,
    paymentMora,
    timestamp,
    uniqueDate,
    pUniqueId,
  };

  const syncProps = {
    data_id: payment_id,
    syncronization_id: `R${common.creditor_id}_${common.collect_date}_${getUniqueID()}`,
    queueTime: Math.floor(Date.now()),
    endPoint: "/bgsync/cobro/payment/create",
    syncType: "createPayment",
    syncAmount: paymentAmount + paymentMora,
    syncTitle: "Pago Aplicado",
    syncName: `Nombre > ${loan.name}`,
    requiredData: true,
  };

  return { collected, applyLoan, sync: { postData, syncProps } };
}

export function getLoansBreakDown(dbLoans) {
  let loansBreakDown = {
    balanceTotal: 0,
    wPaymentTotal: 0,
    activeCount: 0,
    vencidosCount: 0,
    saldadoCount: 0,
    active: {},
    vencidos: [],
    saldado: [],
  };

  if (dbLoans) {
    const loansLength = dbLoans.length;
    for (var i = 0; i < loansLength; i++) {
      const { collect_day, wPayment, balance, current_week, npayments } = dbLoans[i];

      if (+balance > 0) {
        loansBreakDown.balanceTotal += balance;
        loansBreakDown.wPaymentTotal += wPayment;
      }

      if (+balance === 0) {
        loansBreakDown.saldadoCount += 1;
        loansBreakDown.saldado.push(dbLoans[i]);
      } else if (current_week > npayments) {
        loansBreakDown.vencidosCount += 1;
        loansBreakDown.vencidos.push(dbLoans[i]);
      } else {
        loansBreakDown.activeCount += 1;
        if (loansBreakDown.active[collect_day]) {
          loansBreakDown.active[collect_day].loanTotal += wPayment;
          loansBreakDown.active[collect_day].loans.push(dbLoans[i]);
        } else {
          loansBreakDown.active[collect_day] = {
            collect_day,
            loanTotal: wPayment,
            loans: [dbLoans[i]],
          };
        }
      }
    }
  }

  return loansBreakDown;
}

export function getSpanishDays(day) {
  const days = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miercoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sabado",
    Sunday: "Domingo",
  };

  return days[day] ?? "No Day Found";
}

export function calcNewCompleted(loan, paymentAmount) {
  return loan.npayments - Math.ceil((loan.balance - paymentAmount) / loan.wPayment);
}

export function calcNewLoanStatus(loan, paymentAmount) {
  let { statusText, statusAmount } = loan;
  if (loan.paymentAmount + paymentAmount === 0) return { statusText, statusAmount };
  if (loan.balance - paymentAmount === 0) return { statusText: "Saldado", statusAmount: 0 };

  if (loan.statusText !== "Vencido") {
    statusAmount = loan.pending * loan.wPayment - loan.paymentAmount - paymentAmount - loan.incomplete;
    if (statusAmount < 0) {
      statusText = "Adelanto";
    } else if (statusAmount > 0) {
      statusText = "Atrasos";
    } else {
      statusText = "Al Dia";
    }
  } else {
    statusAmount = statusAmount - paymentAmount;
  }

  // return { statusAmount: atrasos + 1, statusText: statusText + 2 };
  return { statusAmount, statusText };
}

export function formatPhoneNumber(str) {
  let cleaned = replaceNonDigits(str);
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? "(" + match[1] + ") " + match[2] + "-" + match[3] : "N/A";
}

export function formatCedula(str) {
  let cleaned = replaceNonDigits(str);
  let match = cleaned.match(/^(\d{3})(\d{7})(\d{1})$/);
  return match ? match[1] + "-" + match[2] + "-" + match[3] : "N/A";
}

export function reduceCollectedPaymentObject(loans) {
  const size = loans.length;
  let newLoans = [];

  var i;
  for (i = 0; i < size; i++) {
    if (loans[i].paymentAmount) {
      newLoans = [
        ...newLoans,
        {
          name: loans[i].name,
          debtor_id: loans[i].debtor_id,
          payment_id: loans[i].payment_id,
          timestamp: loans[i].timestamp,
          uniqueDate: loans[i].uniqueDate,
          pUniqueId: loans[i].pUniqueId,
          money_id: loans[i].money_id,
          deleted: loans[i].deleted ?? undefined,
          paymentAmount: loans[i].paymentAmount,
          paymentMora: loans[i].paymentMora,
          paymentType: loans[i].paymentType,
          // timestamp: loans[i].timestamp,
        },
      ];
    }
  }

  return newLoans;
}

export function validatePhone(required = true) {
  return this.test("validatePhone", required, function (value) {
    const { path, createError } = this;

    if (!value) {
      if (!required) return true;
      return createError({ path, message: "Telefono es requeridad!" });
    }

    const c = String(replaceNonDigits(value));
    if (c === "0000000000") {
      return createError({ path, message: "Telefono no es valido!" });
    }

    if (c.length !== 10) {
      return createError({ path, message: "Telefono no es valido!" });
    }

    return true;
  });
}

export function validateCedula(required = true) {
  return this.test("validateCedula", required, function (value) {
    const { path, createError } = this;

    if (!value) {
      if (!required) return true;
      return createError({ path, message: "Cedula es requeridad!" });
    }

    const c = String(replaceNonDigits(value));
    if (c.length !== 11) {
      return createError({ path, message: "Cedula no es validad!" });
    }

    let cedula = c.substr(0, c.length - 1);
    let verify = c.substr(c.length - 1, 1) * 1;
    const cedulaLength = cedula.length;
    let sum = 0;

    for (let i = 0; i < cedulaLength; i++) {
      let mod;
      if (i % 2 === 0) {
        mod = 1;
      } else {
        mod = 2;
      }

      let rest = cedula.substr(i, 1) * mod;

      if (rest > 9) {
        let newRest = String(rest);
        let one = newRest.substr(0, 1) * 1;
        let two = newRest.substr(1, 1) * 1;
        rest = one + two;
      }
      sum += rest;
    }

    const the_number = (10 - (sum % 10)) % 10;
    const initialValues = String(cedula.substr(0, 3));

    if (the_number !== verify && initialValues !== "000") {
      return createError({ path, message: "Cedula no es validad!" });
    }

    return true;
  });
}

export function printAmount(amount, sign = "$") {
  const pieces = parseFloat(amount).toFixed(0).split("");
  let ii = pieces.length - 0;
  while ((ii -= 3) > 0) {
    pieces.splice(ii, 0, ",");
  }
  return sign + pieces.join("");
}

export function concatPhoneLink(phone) {
  if (phone) {
    return `tel:${phone}`;
  }
  return null;
}

export function RemoveAccents(str) {
  if (!str) {
    console.log(`RemoveAccents received undefined.`);
    return;
  }

  var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split("");
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) !== -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join("");
}

export function getBadgeColor(status) {
  if (status === "Vencido") {
    return "badge badge-pill badge-danger";
  } else if (status === "Atrasos") {
    return "badge badge-pill badge-warning";
  } else if (status === "Adelanto") {
    return "badge badge-pill badge-info";
  } else if (status === "Saldado") {
    return "badge badge-pill badge-secondary";
  } else {
    return "badge badge-pill badge-success";
  }
}

export function forceReload(deleteCache = false) {
  if (deleteCache) {
    // The following codes will delete all caches.
    if (caches) {
      console.log("Cleaning caches");
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });
    }
  }

  window.location.reload();
}

export function deleteCache(forceReload = false) {
  // The following codes will delete all caches.
  if (caches) {
    caches.keys().then(function (names) {
      for (let name of names) {
        caches.delete(name);
        console.log(`Deleting Cache ${name}`);
      }
    });
  }

  if (forceReload) {
    window.location.reload();
  }
}

export async function getCachedData(cacheName, url) {
  const cacheStorage = await caches.open(cacheName);
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    return false;
  }

  return await cachedResponse.json();
}
