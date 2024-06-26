import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Chart } from "react-google-charts";

const Chart3 = () => {
    const [data, setData] = useState('');

    const callAPI = async() => {
        const res = await axios.get('/count/dept');
        console.log(res.data);
        let array=[];
        array.push(['학과명', '학생수']);
        res.data.forEach(row=>
            array.push([`${row.dept}`,parseFloat(row.count)])
        );
        setData(array);
    }

    useEffect(()=> {
        callAPI();
    }, []);

//     const data = [
//     ["Year", "Sales", "Expenses", "Profit"],
//     ["2014", 1000, 400, 200],
//     ["2015", 1170, 460, 250],
//     ["2016", 660, 1120, 300],
//     ["2017", 1030, 540, 350],
//   ];

  const options = {
    chart: {
      title: "학과별 학생수",
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}

export default Chart3