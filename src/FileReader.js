/**
 * @param {*} file The file to read. Expects a BLOB from html input
 * @param {*} callback A function to run when the file is done reading.
 * The results of the file reader is passed to this function.
 */
export const readCSVFile = (file, callback) => {
  let fileReader = new FileReader()

  fileReader.onloadend = (e) => {
    callback(fileReader.result)
  }

  fileReader.readAsText(file);
}

/**
 * @param {*} rawData The data to process. Expects data in raw text
 * @param {*} delimeter The character separating the records. (e.g. "," or "")
 * @returns Returns an object containing the processed data and meta data
 */
export const processFile = (rawData, delimeter) => {
  const data = rawData.split("\n");
  const [heading, ...rows] = data

  // Transform data into an array of arrays
  let parsedData = [];

  for (let row of rows) {
    if (row !== "") { // remove empty rows
      row=row.trim();
      parsedData = [...parsedData, splitWithDelimeter(row, delimeter)]
    }
  }
  
  let transformedData = replaceBadValues(parsedData);

  return {
    data: [heading, ...transformedData.data],
    counter: transformedData.counter
  };
}

/**
 * @param {*} data The data to split
 * @param {*} delimeter The character separating the data
 * @returns Returns the splitted data in an array
 */
const splitWithDelimeter = (data, delimeter) => {
  if (delimeter === ",") {
    return data.split(",")
  } else return data.split(" ")
}

/**
 * 
 * @param {*} rawData The data containing the bad values to replace
 * @returns Returns an object containing the good data and meta data
 */
const replaceBadValues = (rawData) => {
  let transformedData = [];
  let counter = 0;

  for(let i = 0; i < rawData.length; i++) {
    let newData = rawData[i];

    for (let j = 0; j < newData.length; j++ ) {
      if (newData[j] == 0) {
        const neighbour = getNearestNeighbour(i, j, rawData);
        if (neighbour != 0) {
          newData[j] = neighbour;
          counter ++;
        }
      }
    }
    transformedData = [...transformedData, newData]
  }
  return {
    data: transformedData,
    counter
  };
}

/**
 * This function searches the north, south, west and east of
 * the current matrix[row][col] to find a good neighbour.
 * Good neighbours are those whose values are not 0.
 * @param {*} row The current row
 * @param {*} col The current col
 * @param {*} rawData The data being processed
 * @returns Returns a good neighbour if found
 */
const getNearestNeighbour = (row, col, rawData) => {
  let good = 0;
  let done = false;
  
  while(!done) {
    // search from the west
    if(col > 0) {
      good = rawData[row][col -1]
      if (good != 0) {
        done = true;
        return good;
      }
    }

    // search east
    if (col < ((rawData[row].length) - 1)) {
      good = rawData[row][col + 1]
      if(good != 0) {
        done = true;
        return good;
      }
    }

    // search north
    if(row > 0) {
      good = rawData[row - 1][col]
      if(good != 0) {
        done=true
        return good;
      }
    }

    // search south
    if(row < rawData.length - 1) {
      good = rawData[row + 1][col]
      if(good != 0){
        done = true;
        return good;
      }
    }

    // did not find a good neighbour
    done = true;
  }
  return good;
}