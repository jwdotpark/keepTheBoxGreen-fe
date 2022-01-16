// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import appApiClient from "../../api/appApiClient";
import { TelemetryItemProps, ResponseTelemetryDataProps } from "../../types";
import "../../App.css";
import { Rnd } from "react-rnd";
import Container from "../../components/container";
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Text,
} from "@chakra-ui/react";

const Home = () => {
  const [telemetryData, setTelemetryData] = useState<TelemetryItemProps>([]);
  const fetchData = async () => {
    try {
      const response = await appApiClient.get<ResponseTelemetryDataProps>("/");
      setTelemetryData(response.data.telemetryData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValue = {
    humidityHeight: 0.75,
    temperature: 25,
    particle: 200,
    sittingTime: 0,
  };

  // panel form value
  const [values, setValues] = useState(initialValue);

  const style = {
    display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 2px #ddd",
    background: "#f0f0f0",
    zIndex: 2,
    borderRadius: "10px",
    minWidth: 300,
    minHeight: 300,
  };

  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    sessionStorage.setItem("humidityHeight", values.humidityHeight);
    sessionStorage.setItem("temperature", values.temperature);
    sessionStorage.setItem("particle", values.particle);
    sessionStorage.setItem("sittingTime", values.sittingTime);
  }, [values])


  // self incrementing sitting time
  function useInterval(callback, delay) {
    const savedCallback = useRef();
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
    // Set up the interval
    useEffect(() => {
      let id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

  let [counter, setCounter] = useState(0);
  const count = () => {
    // reset at 60
    if (counter < 60) {
      return counter + 2
    } else {
      return counter = 0
    }
  }

  useInterval(() => {
    setCounter(count);
    setValues({ ...values, sittingTime: counter })
  }, 1000);

  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <div className="dragZone" style={{ width: "100vw", height: "100vh" }}>
        <Box align="right" >
          <Button
            m="5"
            size="xs"
            onClick={toggle}
            sx={{ zIndex: 2 }}
            borderRadius="25px"
          >
            {isOpen ? "Close Panel" : "Open Panel"}
          </Button>
        </Box>


        {/* floating panel */}

        {/* <Text>{JSON.stringify(values)}</Text> */}

        {isOpen && (
          <Rnd
            style={style}
            default={{
              x: Math.floor(Math.random() * window.innerWidth) / 2,
              y: Math.floor(Math.random() * window.innerHeight) / 2,
              width: window.innerWidth / 4,
              height: window.innerHeight / 4,
            }}
            minWidth={300}
            minHeight={300}
            maxHeight={window.innerHeight / 3}
            maxWidth={window.innerWidth / 3}
            bounds={".dragZone"}
          >
            <Box w="100%">
              <Tabs size="sm">
                <TabList>
                  <Tab>Device Data</Tab>
                  <Tab>Mockup Data</Tab>
                  <Tab>About</Tab>
                </TabList>
                <TabPanels>
                  {/* current data */}
                  <TabPanel>
                    {telemetryData.map(
                      (telemetryItem: TelemetryItemProps, index, array) =>
                        array.length - 1 === index && (
                          <div key={index}>
                            <Table size='xs' variant='striped'>
                              <TableCaption placement='bottom'>Data from Azure</TableCaption>
                              <Thead>
                                <Tr>
                                  <Th>Name</Th>
                                  <Th>Value</Th>
                                </Tr>
                              </Thead>
                              <Tbody>

                                <Tr>
                                  <Td>Date</Td>
                                  <Td>{telemetryItem.EventEnqueuedUtcTime.substring(
                                    0,
                                    10
                                  )}</Td>
                                </Tr>

                                <Tr>
                                  <Td>Time</Td>
                                  <Td>{telemetryItem.EventEnqueuedUtcTime.substring(11, 19)}</Td>
                                </Tr>

                                <Tr>
                                  <Td>Sitting Time</Td>
                                  <Td>{telemetryItem.sittingTime}</Td>
                                </Tr>

                                <Tr>
                                  <Td>Temperature</Td>
                                  <Td>{telemetryItem.temperature}°</Td>
                                </Tr>

                                <Tr>
                                  <Td>Humidity</Td>
                                  <Td>{telemetryItem.humidity}%</Td>
                                </Tr>

                                <Tr>
                                  <Td>Dust Contentration</Td>
                                  <Td>{telemetryItem.dustConcentration}μg/㎥</Td>
                                </Tr>

                              </Tbody>
                            </Table>
                          </div>
                        )
                    )}
                  </TabPanel>
                  <TabPanel>
                    {/* humidity */}
                    <Box>
                      <p>Humidity: {values.humidityHeight * 100 - 35}%</p>
                      <Slider
                        aria-label="slider-ex-1"
                        defaultValue={40}
                        min={0}
                        max={100}
                        onChange={(value) => {
                          setValues({ ...values, humidityHeight: value / 100 + 0.35 });
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>

                    {/* temperature */}
                    <Box>
                      <p>Temperature: {values.temperature}°</p>
                      <Slider
                        aria-label="slider-ex-1"
                        defaultValue={25}
                        min={0}
                        max={50}
                        onChange={(value) => {
                          setValues({ ...values, temperature: value });
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>

                    {/* particle */}
                    <Box>
                      <p>Dust Level: {values.particle}μg/㎥</p>
                      <Slider
                        aria-label="slider-ex-1"
                        defaultValue={200}
                        min={0}
                        max={500}
                        onChange={(value) => {
                          setValues({ ...values, particle: value });
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>

                    {/* sitting time */}
                    <Box>
                      <p>Sitting Time: {values.sittingTime}</p>
                      <Slider
                        disabled
                        aria-label="slider-ex-1"
                        defaultValue={0}
                        max={60}
                        value={values.sittingTime}
                        onChange={(value) => {
                          setValues({ ...values, sittingTime: value });
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>

                  </TabPanel>
                  <TabPanel>
                    {/* <p>okja is cute dog</p> */}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Rnd>
        )}

        {/* floating panel end*/}

        <Container />
      </div>
    </div >
  );
};

export default Home;
