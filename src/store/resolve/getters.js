export const arbSeatsAvailable = ({ config, arbitrators }) => {
  const { max_elected_arbs } = config;
  let occupiedSeats = 0;

  const nowTimestamp = Math.floor(Date.now() / 1000);
  arbitrators.forEach(({ term_expiration }) => {
    const expirationTimestamp =
      new Date(term_expiration + "Z").getTime() / 1000;
    if (expirationTimestamp > nowTimestamp) {
      occupiedSeats++;
    }
  });

  const availableSeats = max_elected_arbs - occupiedSeats;
  console.log("availableSeats", availableSeats);
  return availableSeats;
};

export const isResolveStoresAvailable = (resolve) => {
  console.log("resolve: ", resolve);
  if (!resolve) return false;
  const { config, arbitrators, elections, nominees, case_files } = resolve;
  const isAvailable = !!(
    config &&
    arbitrators &&
    elections &&
    nominees &&
    case_files
  );
  console.log("isAvailable", isAvailable);
  return isAvailable;
};
