let order = [];
let editingRoomIndex = null;
let editingWindowIndex = null;

function startRoom() {
  const room = document.getElementById("roomName").value.trim();
  if (!room) return alert("Please enter a room name.");

  order.push({ room, windows: [] });
  editingRoomIndex = order.length - 1; // Set the active room index

  document.getElementById("currentRoomHeader").innerText = `Adding windows for ${room}`;
  document.getElementById("step-room").style.display = "none";
  document.getElementById("step-windows").style.display = "block";
  document.getElementById("step-summary").style.display = "none";
  document.getElementById("roomSummaryTable").innerHTML = "";
}

function renderRoomSummary() {
  const table = document.getElementById("roomSummaryTable");

  if (editingRoomIndex === null) return;

  const currentRoom = order[editingRoomIndex];
  table.innerHTML = "<tr><th>Style</th><th>Fabric</th><th>Color</th><th>Opacity</th><th>Height</th><th>Width</th><th>Rail Color</th><th>Quantity</th><th>Price</th><th>Actions</th></tr>";

  currentRoom.windows.forEach((win, index) => {
    table.innerHTML += `<tr>
      <td>${win.style}</td>
      <td>${win.fabric}</td>
      <td>${win.color}</td>
      <td>${win.opacity}</td>
      <td>${win.height}</td>
      <td>${win.width}</td>
      <td>${win.railColor}</td>
      <td>${win.quantity}</td>
      <td>$${parseFloat(win.price).toFixed(2)}</td>
      <td class="icon-cell">
        <button onclick="editWindow(editingRoomIndex, ${index})">✏️</button>
        <button onclick="deleteWindow(editingRoomIndex, ${index})">🗑️</button>
      </td>
    </tr>`;
  });
}

function editRoom(roomIndex) {
  editingRoomIndex = roomIndex;
  editingWindowIndex = null;

  document.getElementById("step-summary").style.display = "none";
  document.getElementById("step-windows").style.display = "block";
  document.getElementById("currentRoomHeader").innerText = `Editing ${order[roomIndex].room}`;

  // Show the room summary section
  document.getElementById("roomSummarySection").style.display = "block";

  renderRoomSummary();
}
function addWindowToRoom(roomIndex) {
  editingRoomIndex = roomIndex;
  editingWindowIndex = null;

  document.getElementById("step-summary").style.display = "none";
  document.getElementById("step-windows").style.display = "block";
  document.getElementById("currentRoomHeader").innerText = `Adding window to ${order[roomIndex].room}`;
  document.getElementById("windowForm").reset();

  document.getElementById("roomSummarySection").style.display = "block";
  renderRoomSummary();
}

document.getElementById("windowForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const windowData = Object.fromEntries(formData.entries());

  if (editingRoomIndex !== null && editingWindowIndex !== null) {
    // Editing an existing window
    order[editingRoomIndex].windows[editingWindowIndex] = windowData;
    editingWindowIndex = null; // Keep editingRoomIndex so summary still renders
  } else if (editingRoomIndex !== null) {
    // Adding a new window to the correct room
    order[editingRoomIndex].windows.push(windowData);
  } else {
    alert("No room selected for this window.");
    return;
  }

  this.reset();

  // Ensure the summary section is visible
  document.getElementById("roomSummarySection").style.display = "block";

  // Re-render the summary for the current room
  renderRoomSummary();
});

function finishRoom() {
  document.getElementById("step-windows").style.display = "none";
  document.getElementById("step-room").style.display = "block";
  document.getElementById("roomName").value = "";
  document.getElementById("roomSummaryTable").innerHTML = ""; // Hide room summary
  renderSummary();

  document.getElementById("roomSummarySection").style.display = "none";
}

function renderSummary() {
  document.getElementById("step-summary").style.display = "block";
  const table = document.getElementById("summaryTable");
  table.innerHTML = "<tr><th>Room</th><th>Style</th><th>Fabric</th><th>Color</th><th>Opacity</th><th>Height</th><th>Width</th><th>Rail Color</th><th>Quantity</th><th>Price</th><th>Actions</th></tr>";
  let total = 0;

  order.forEach(({ room, windows }, roomIndex) => {
    // Render room header first
    table.innerHTML += `
  <tr class="room-header">
    <td colspan="11" style="text-align:left; background-color: #f5f5f5;">
      <div class="room-header-flex">
        <span class="room-name" style="font-weight: bold;">${room}</span>
        <span class="room-actions">
            <button onclick="addWindowToRoom(${roomIndex})" class="room-link">➕ Add Window</button>
        </span>
      </div>
    </td>
  </tr>
`;

    // Then render each window row
    windows.forEach((win, windowIndex) => {
      const price = parseFloat(win.price) || 0;
      total += price;
      table.innerHTML += `<tr>
        <td>${room}</td>
        <td>${win.style}</td>
        <td>${win.fabric}</td>
        <td>${win.color}</td>
        <td>${win.opacity}</td>
        <td>${win.height}</td>
        <td>${win.width}</td>
        <td>${win.railColor}</td>
        <td>${win.quantity}</td>
        <td>$${price.toFixed(2)}</td>
        <td class="icon-cell">
          <button onclick="editWindow(${roomIndex}, ${windowIndex})">✏️</button>
          <button onclick="deleteWindow(${roomIndex}, ${windowIndex})">🗑️</button>
        </td>
      </tr>`;
    });
  });

  document.getElementById("totalPrice").innerText = `Total: $${total.toFixed(2)}`;
}

function editWindow(roomIndex, windowIndex) {
  const win = order[roomIndex].windows[windowIndex];
  const form = document.getElementById("windowForm");
  for (const key in win) {
    if (form.elements[key]) {
      form.elements[key].value = win[key];
    }
  }

  editingRoomIndex = roomIndex;
  editingWindowIndex = windowIndex;

  document.getElementById("step-summary").style.display = "none";
  document.getElementById("step-windows").style.display = "block";
  document.getElementById("currentRoomHeader").innerText = `Editing window in ${order[roomIndex].room}`;

  document.getElementById("roomSummarySection").style.display = "block"; 
  renderRoomSummary();
}

function deleteWindow(roomIndex, windowIndex) {
  order[roomIndex].windows.splice(windowIndex, 1);

  const isInSummaryView = document.getElementById("step-summary").style.display === "block";

  if (isInSummaryView) {
    renderSummary();
  } else {
    renderRoomSummary();

    // Hide section if no windows remain
    if (order[roomIndex].windows.length === 0) {
      document.getElementById("roomSummarySection").style.display = "none";
    }
  }
}

function submitOrder() {
  alert("Order submitted! Thank you for choosing Ashland Blinds.");
  // You can integrate EmailJS or backend logic here
}

