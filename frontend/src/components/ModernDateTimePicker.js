import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

const ModernDateTimePicker = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

  const formatTimeWithAMPM = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const minuteStr = minutes.toString().padStart(2, "0");
    return `${hour12}:${minuteStr} ${period}`;
  };

  return (
    <PaperProvider>
      <View style={{ padding: 20 }}>
        <Button
          title={
            "Date: " + selectedDate?.toDateString() + "" ??
            new Date().getTime() + " "
          }
          onPress={() => setDateVisible(true)}
        />

        <DatePickerModal
          mode="single"
          visible={dateVisible}
          onDismiss={() => setDateVisible(false)}
          date={selectedDate}
          onConfirm={(params) => {
            setDateVisible(false);
            setSelectedDate(params.date);
          }}
        />

        <Button
          title={
            selectedTime
              ? formatTimeWithAMPM(selectedTime.hours, selectedTime.minutes)
              : new Date().toISOString().split("T")[1] + " "
          }
          onPress={() => setTimeVisible(true)}
          style={{ marginTop: 20 }}
        />

        <TimePickerModal
          visible={timeVisible}
          onDismiss={() => setTimeVisible(false)}
          onConfirm={({ hours, minutes }) => {
            setTimeVisible(false);
            setSelectedTime({ hours, minutes });
          }}
          hours={selectedTime?.hours || 12}
          minutes={selectedTime?.minutes || 0}
          label="Select time"
        />
      </View>
    </PaperProvider>
  );
};

export default ModernDateTimePicker;
