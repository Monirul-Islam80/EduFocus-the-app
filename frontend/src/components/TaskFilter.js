import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Chip, Menu, Button, IconButton, Icon } from "react-native-paper";

const TaskFilter = ({
  calIcon,
  setcalIcon,
  calFilter,
  setcalFilter,
  filter,
  setFilter,
}) => {
  const [visible, setVisible] = useState(false);
  const [calvisible, setcalVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Menu
          visible={calvisible}
          onDismiss={() => setcalVisible(false)}
          anchor={
            <Button icon={calIcon} onPress={() => setcalVisible(true)}>
              {calFilter}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setcalFilter("Day");
              setcalIcon("calendar-today");
              setTimeout(() => setcalVisible(false), 0);
            }}
            title="Day"
            leadingIcon="calendar-today"
          />

          <Menu.Item
            onPress={() => {
              setcalFilter("Week");
              setcalIcon("calendar-week");
              setTimeout(() => setcalVisible(false), 0);
            }}
            title="Week"
            leadingIcon="calendar-week"
          />
          <Menu.Item
            onPress={() => {
              setcalFilter("Month");
              setcalIcon("calendar-month");
              setTimeout(() => setcalVisible(false), 0);
            }}
            title="Month"
            leadingIcon="calendar-month"
          />
        </Menu>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button
              icon="filter-variant"
              contentStyle={{ flexDirection: "row-reverse" }}
              onPress={() => setVisible(true)}
            >
              {filter}
            </Button>
          }
        >
          <Menu.Item onPress={() => setFilter("All")} title="All" />
          <Menu.Item onPress={() => setFilter("Low")} title="Low Priority" />
          <Menu.Item
            onPress={() => setFilter("Medium")}
            title="medium Priority"
          />
          <Menu.Item onPress={() => setFilter("High")} title="High Priority" />
          <Menu.Item
            onPress={() => setFilter("Assignments")}
            title="Assignments"
          />
          <Menu.Item onPress={() => setFilter("Reading")} title="Reading" />
        </Menu>
      </View>
    </View>
  );
};

export default TaskFilter;
