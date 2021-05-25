import './App.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import LineChart from './LineChart';

function App() {

  const initialValues = {
    fromDate: "",
    fromMonth: "",
    toDate: "",
    toMonth: ""
  };

  useEffect(() => {
    regenerateData({data:{1902:'77.5', 1905:'88',1910:'90'}})
  }, []);

  const [monthNames, setMonthNames] = useState({fromMonth:"",toMonth:""})
  const [values, setValues] = useState(initialValues);
  const [chartdata, setData] = useState([]);
  const [title, setTitle] = useState({units:"Y axis", base_period:"X axis"});

  const months = {
    "1":"January",
    "2":"February",
    "3":"March",
    "4":"April",
    "5":"May",
    "6":"June",
    "7":"July",
    "8":"August",
    "9":"September",
    "10":"October",
    "11":"November",
    "12":"December"
  }

  const handleSelect = (e) => {
    const [name, value] = e.split(",");
    //console.log(name, value)
    setValues({
      ...values,
      [name]: value
    })
    setMonthNames({
      ...monthNames,
      [name]: months[value]
    })
  }

  const requestData = () => {
    fetch(`https://www.ncdc.noaa.gov/cag/global/time-series/globe/land_ocean/${values.fromMonth}/${values.toMonth}/${values.fromDate}-${values.toDate}/data.json`).then(res => {
      return res.json();
    }).then(response => { 
      setTitle(response.description)
      regenerateData(response)
    })
  }

  const data = {}

  const reset = () => {
    setValues(initialValues)
    setMonthNames({fromMonth:"",toMonth:""})
  }



  function regenerateData(d) {
    const chartData = [];
    let i = '';
    let value = ''
    for (let i in d.data) {
      //const value = Math.floor(Math.random() * i + 3);
      value = d['data'][i];
      console.log(value)
      chartData.push({
        label: i,
        value,
        tooltipContent: `<b>x: </b>${i}<br><b>y: </b>${value}`,
      });
    }
    setData(chartData);
  }

  return (
    <div className="App">
      <header className="App-header">
      <div className="row" style={{width:"60%"}}>
        <div className="col-lg-2">
          <DropdownButton
            //as={ButtonGroup}
            name="fromDate"
            key="fromDate"
            id={`dropdown-variants-Primary`}
            variant="Primary"
            title={values.fromDate  || "From Year"}
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="fromDate,2000">2000</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1999">1999</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1998">1998</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1997">1997</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1996">1996</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1995">1995</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1998">1994</Dropdown.Item>
            <Dropdown.Item eventKey="fromDate,1993">1993</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="col-lg-2">
          <DropdownButton
            //as={ButtonGroup}
            name="fromMonth"
            key="fromMonth"
            id={`dropdown-variants-Primary`}
            variant="Primary"
            title={monthNames.fromMonth  || "From Month"}
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="fromMonth,1">January</Dropdown.Item>
            <Dropdown.Item eventKey="fromMonth,2">February</Dropdown.Item>
            <Dropdown.Item eventKey="fromMonth,3">March</Dropdown.Item>
            <Dropdown.Item eventKey="fromMonth,4">April</Dropdown.Item>
          </DropdownButton>
        </div>
        {/*<div className="col-sm-1"></div>*/}
        <div className="col-lg-2">
          <DropdownButton
              //as={ButtonGroup}
              name="toDate"
              key="toDate"
              id={`dropdown-variants-Primary`}
              variant="Primary"
              title={values.toDate  || "To Year"}
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="toDate,2000">2000</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1999">1999</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1998">1998</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1997">1997</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1996">1996</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1995">1995</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1994">1994</Dropdown.Item>
              <Dropdown.Item eventKey="toDate,1993">1993</Dropdown.Item>
            </DropdownButton>
        </div>
        <div className="col-lg-2">
          <DropdownButton
            //as={ButtonGroup}
            name="toMonth"
            key="toMonth"
            id={`dropdown-variants-Primary`}
            variant="Primary"
            title={monthNames.toMonth  || "To Month"}
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="toMonth,1">January</Dropdown.Item>
            <Dropdown.Item eventKey="toMonth,2">February</Dropdown.Item>
            <Dropdown.Item eventKey="toMonth,3">March</Dropdown.Item>
            <Dropdown.Item eventKey="toMonth,4">April</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="col-lg-2">
         <Button onClick={requestData}>Plot Chart</Button>
        </div>
        <div className="col-lg-2">
         <Button onClick={reset}>Reset Dates</Button>
        </div>
      </div>
      </header>
        <LineChart
          svgProps={{
            margin: { top: 70, bottom: 80, left: 80, right: 80 },
            width: 861,
            height: 349,
          }}
          axisProps={{
            xLabel: title.base_period,
            yLabel: title.units,
          }}
          data={chartdata}
          strokeWidth={4}
        />
        <div className="row" style={{marginLeft: '8%'}}>
          <div className="col-lg-6" style={{width:'587px',height:500, border:'9px solid #72c6ed'}}>
            <div style={{marginTop:10}}>Header text</div>
            <hr />
          </div>
          <div className="col-lg-6" style={{width:'587px',height:500, border:'9px solid #72c6ed'}}>
            <div style={{marginTop:10}}>This is the long header text</div>
            <hr />
          </div>
        </div>
    </div>
  );
}

export default App;
