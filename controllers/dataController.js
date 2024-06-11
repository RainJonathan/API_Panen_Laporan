const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

// Function to stringify BigInt values
const stringifyBigInt = (key, value) => {
    if (typeof value === 'bigint') {
        return value.toString();
    } else if (typeof value === 'object' && value !== null && value.constructor === BigInt) {
        return value.toString();
    } else {
        return value;
    }
};

// Function to generate all dates for a given month and year
const generateDatesForMonth = (year, month) => {
    const dates = [];
    const date = new Date(year, month - 1, 1);
    while (date.getMonth() === month - 1) {
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${day}-${String(month).padStart(2, '0')}-${year}`;
        dates.push(formattedDate);
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

// Function to organize data by date and nama
const organizeDataByDateAndNama = (data, year, month) => {
  const organizedData = {};
  const allDates = generateDatesForMonth(year, month);

  // Initialize organizedData with all dates in the month
  allDates.forEach(date => {
      organizedData[date] = {};
      // Initialize all "nama" entries with 5 numbered entries
      data.forEach(entry => {
          const nama = entry.nama;
          organizedData[date][nama] = {};
          for (let i = 1; i <= 5; i++) {
              organizedData[date][nama][i] = {};
          }
      });
  });

  // Populate organizedData with actual data entries
  data.forEach(entry => {
      const createdDate = entry.created_date ? new Date(entry.created_date) : null;
      if (createdDate) {
          const day = String(createdDate.getDate()).padStart(2, '0');
          const formattedDate = `${day}-${String(month).padStart(2, '0')}-${year}`;
          const nama = entry.nama;

          // Find the first empty spot (key) in the "nama" entry and assign the entry to it
          for (let i = 1; i <= 5; i++) {
              if (Object.keys(organizedData[formattedDate][nama][i]).length === 0) {
                  organizedData[formattedDate][nama][i] = entry;
                  break;
              }
          }
      }
  });

  return organizedData;
};


const getDataByMonth = async (req, res) => {
    const { kebun, month, year } = req.params;
    const validLocations = [
        'thg', 'pkt', 'sm', 'bh1', 'bh2', 'bk1', 'bk2', 'pj', 'psb', 'rk',
        'tt', 'kp', 'mb', 'tpil', 'kandir', 'dbr', 'hnd', 'ngl', 'brb', 
        'pksthg', 'cdr', 'djl', 'ka', 'pku', 'sbb'
    ];
    // Validate kebun, month, and year parameters
    const schema = Joi.object({
        kebun: Joi.string().valid(...validLocations).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    });

    const { error } = schema.validate({ kebun, month: parseInt(month), year: parseInt(year) });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        // Construct a SQL query to filter data by the kebun, month, and year
        const data = await prisma.$queryRawUnsafe(`
            SELECT * FROM ${kebun}_trs_gaji
            WHERE MONTH(created_date) = ${parseInt(month)} AND YEAR(created_date) = ${parseInt(year)}
        `);

        // Organize the fetched data by date and nama
        const organizedData = organizeDataByDateAndNama(data, year, month);

        // Serialize the data, handling BigInt values
        const serializedData = JSON.parse(JSON.stringify(organizedData, stringifyBigInt));

        res.json(serializedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getDataByMonth
};
