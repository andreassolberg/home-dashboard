const minefondConfig = [
  {
    id: 2164227,
    buy: 986.8402,
    date: "2023-11-10",
    label: "Multifactor",
    unit: 1,
  },

  {
    id: 2091531,
    isin: "NO0010788292",
    buy: 2202.4797,
    date: "2023-11-19",
    label: "ESG Plus",
    unit: 1,
  },
  {
    id: 2115663,
    buy: 1968.1745,
    date: "2023-11-19",
    label: "Indeks",
    unit: 3,
  },
];

const annualizeCompoundedInterestRate = (days, interestRate) => {
  const daysInYear = 365; // Adjust if your context is different.

  // Calculate the annual interest rate with compounding
  let annualInterestRate = Math.pow(interestRate, daysInYear / days);

  return annualInterestRate;
};

const daysAgo = (d) => {
  let today = new Date();
  let date1 = new Date(d);
  // Calculate the difference in milliseconds
  let differenceInMilliseconds = Math.abs(today - date1);

  // Convert milliseconds to days
  let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  return Math.floor(differenceInDays);
};

export default class FondData {
  constructor() {}

  async getRaw() {
    return fetch(
      "https://finansportalen.api.solweb.no/services/fund/aksjefond"
    ).then((response) => response.json());
  }

  async getData() {
    return this.getRaw().then((aksjefond) => {
      let fl = [];
      //let minefondIds = minefondConfig.map((d) => d.id);
      let c = 0;
      minefondConfig.forEach((f) => {
        let found = aksjefond.find(
          (d) =>
            d.id === f.id && (!f.hasOwnProperty("isin") || d.isin === f.isin)
        );

        if (found) {
          let price = parseFloat(found.price, 10);
          let ago = daysAgo(f.date);
          let interest = price / f.buy;
          let annual = annualizeCompoundedInterestRate(ago, interest);
          fl.push({
            ...f,
            name: found.security_name,
            price,
            interest,
            ago,
            annual,
            cummulative: c,
            unit: f.unit,
          });
          c += f.unit;
        }
      });
      fl.totalWidth = c;
      return fl;
    });
  }
}
