import {json} from "d3";

json('/dataTree.json')
  .then(data => {
console.log(data)})
.catch(err => {
        // Do something for an error here
        console.log("Error Reading data " + err);
      });

// fetch('./data.json').then(response => {
//     console.log(response);
//     return response.json();
//   }).then(data => {
//     // Work with JSON data here
//     console.log(data);
//   }).catch(err => {
//     // Do something for an error here
//     console.log("Error Reading data " + err);
//   });

const TreeChart = () => {

    return (
        <div>
            jjj
        </div>
    )
}

export default TreeChart


