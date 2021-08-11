export const readCSVFile = (file, callback) => {
  let fileReader = new FileReader()

  fileReader.onloadend = (e) => {
    callback(fileReader.result)
  }

  fileReader.readAsText(file);
}

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

const splitWithDelimeter = (data, delimeter) => {
  if (delimeter === ",") {
    return data.split(",")
  } else return data.split(" ")
}

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