import React, { useEffect, useState } from "react";
import axios from "axios";
import { HStack, Select, Spacer, Stack, Text } from "@chakra-ui/react";
import useUserStore from "../../Hooks/Zustand/Store";
import { Chart } from "chart.js/auto";
import { useParams } from "react-router-dom";

function ChartsPieOrder() {
  const [chartData, setChartData] = useState({});
  const [chartInstance, setChartInstance] = useState(null);
  const [time, setTime] = useState("30");

  const globalState = useUserStore();
  const params = useParams();

  const getDataPie = async () => {
    const dataPaymentSearch = [
      "cash",
      "transfer_bank",
      "edc",
      "online",
      "undefined",
    ];
    const chartData = {
      labels: dataPaymentSearch,
      datasets: [
        {
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", // warna untuk 'cash'
            "rgba(75, 192, 192, 0.6)", // warna untuk 'transfer_bank'
            "rgba(255, 206, 86, 0.6)", // warna untuk 'edc'
            "rgba(54, 162, 235, 0.6)", // warna untuk 'online'
            "rgba(153, 102, 255, 0.6)", // warna untuk 'undefined'
          ],
        },
      ],
    };

    const colorMapping = {
      cash: 0,
      transfer_bank: 1,
      edc: 2,
      online: 3,
      undefined: 4,
    };

    const apiCalls = dataPaymentSearch.map(async (paymentMethod) => {
      const dataApi = {
        dateRange: time,
        module: "rms",
        outlet: params.id,
        paymentMethod: paymentMethod,
      };

      try {
        const res = await axios.post(
          "https://deoapp-backend-awfnqqp6oq-et.a.run.app/analytics_orders_pie",
          dataApi
        );
        const data = res.data;
        const colorIndex = colorMapping[paymentMethod];
        chartData.datasets[0].data[colorIndex] = data[paymentMethod];
      } catch (error) {
        console.log(error, "ini err");
        const colorIndex = colorMapping[paymentMethod];
        chartData.datasets[0].data[colorIndex] = 0;
      }
    });

    await Promise.all(apiCalls);
    setChartData(chartData);
  };

  useEffect(() => {
    if (params.id) {
      getDataPie();
    }

    return () => {
      setChartData({});
    };
  }, [time]);

  useEffect(() => {
    if (chartData.labels && chartData.labels.length > 0) {
      // Hancurkan chart yang sudah ada jika ada
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = document.getElementById("myPieChart").getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "pie",
        data: chartData,
      });

      // Simpan instance chart yang baru
      setChartInstance(newChartInstance);
    }
  }, [chartData, time, globalState.currentOutlet]);

  return (
    <Stack className="pie-chart" spacing={2}>
      <HStack>
        <Text fontSize={"md"} fontWeight={500} textTransform="capitalize">
          List order {time} day
        </Text>
        <Spacer />
        <Select
          size={"sm"}
          defaultValue={time}
          borderRadius="md"
          w={"50%"}
          placeholder="Select option"
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="1">1 Day</option>
          <option value="7">7 Day</option>
          <option value="30">30 Day</option>
          <option value="all">All</option>
        </Select>
      </HStack>
      <canvas id="myPieChart" width="auto" height="auto"></canvas>
    </Stack>
  );
}

export default ChartsPieOrder;
