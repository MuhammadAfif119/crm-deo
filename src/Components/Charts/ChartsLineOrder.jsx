import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HStack, Select, Spacer, Stack, Text } from "@chakra-ui/react";
import useUserStore from "../../Hooks/Zustand/Store";
import { Chart } from "chart.js/auto";
import { useParams } from "react-router-dom";

function ChartsLineOrder() {
  const chartContainer = useRef(null);
  const [chart, setChart] = useState(null);
  const [time, setTime] = useState("30");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const globalState = useUserStore();
  const params = useParams();

  const fetchData = async () => {
    const dataApi = {
      dateRange: time,
      module: "rms",
      outlet: params.id,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await axios.post(
        "https://deoapp-backend-awfnqqp6oq-et.a.run.app/analytics_orders_line",
        dataApi
      );
      const data = response.data.reverse();

      const dates = data.map((entry) => entry.date);
      const cashValues = data.map((entry) => entry[paymentMethod]); // Menggunakan paymentMethod sebagai properti dinamis

      const ctx = chartContainer.current.getContext("2d");

      if (chart) {
        chart.destroy();
      }

      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: paymentMethod,
              data: cashValues,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(75,192,192,1)",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });

      setChart(newChart);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }

    return () => {
      setChart(null);
    };
  }, [time, paymentMethod]);

  return (
    <Stack className="line-chart" spacing={2}>
      <HStack>
        <Text fontSize={"md"} fontWeight={500} textTransform="capitalize">
          Line order {time} day
        </Text>
        <Spacer />
        <Stack>
          <Select
            size={"sm"}
            borderRadius="md"
            placeholder="Select option"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="1">1 Day</option>
            <option value="7">7 Day</option>
            <option value="30">30 Day</option>
            <option value="all">All</option>
          </Select>
          <Select
            size={"sm"}
            borderRadius="md"
            placeholder="Select Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="transfer_bank">Transfer Bank</option>
            <option value="edc">EDC</option>
            <option value="online">Online</option>
            <option value="undefined">Undefined</option>
          </Select>
        </Stack>
      </HStack>
      <canvas ref={chartContainer} width="auto" height="auto"></canvas>
    </Stack>
  );
}

export default ChartsLineOrder;
