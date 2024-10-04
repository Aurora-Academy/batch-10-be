const Model = require("./order.model");
const roomModel = require("../rooms/room.model");

const create = async (payload) => {
  const { updated_by, ...rest } = payload;
  rest.created_by = updated_by;
  const rooms = rest?.rooms || [];
  rooms.map(async (room) => {
    const isRoomAvailable = await roomModel.findOne({
      _id: room?.room,
      status: "empty",
    });
    if (!isRoomAvailable) throw new Error("Room is not available");
    await roomModel.findOneAndUpdate(
      {
        _id: room?.room,
      },
      { status: "booked" },
      { new: true }
    );
  });
  return Model.create(rest);
};

const getByOrderNumber = (orderNo, filter) => {
  return Model.findOne({ number: orderNo, ...filter });
};

const list = async ({ filter, search, page = 1, limit = 10 }) => {
  let currentPage = +page;
  currentPage = currentPage < 1 ? 1 : currentPage;
  const { number } = search;
  const query = [];
  if (filter?.status) {
    query.push({
      $match: {
        status: filter?.status,
      },
    });
  }
  if (number) {
    query.push({
      $match: {
        number: new RegExp(number, "gi"),
      },
    });
  }
  query.push(
    {
      $unwind: {
        path: "$rooms",
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "rooms.room",
        foreignField: "_id",
        as: "roomDetails",
      },
    },
    {
      $unwind: {
        path: "$roomDetails",
      },
    },
    {
      $group: {
        _id: "$_id",
        name: {
          $first: "$name",
        },
        email: {
          $first: "$email",
        },
        arrivalDate: {
          $first: "$arrivalDate",
        },
        departureDate: {
          $first: "$departureDate",
        },
        status: {
          $first: "$status",
        },
        amount: {
          $first: "$amount",
        },
        created_by: {
          $first: "$created_by",
        },
        number: {
          $first: "$number",
        },
        createdAt: {
          $first: "$createdAt",
        },
        updatedAt: {
          $first: "$updatedAt",
        },
        rooms: {
          $push: {
            price: "$rooms.price",
            amount: "$rooms.amount",
            room: "$roomDetails",
          },
        },
      },
    },
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (currentPage - 1) * +limit,
          },
          {
            $limit: +limit,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        metadata: 0,
      },
    }
  );
  const result = await Model.aggregate(query);
  return {
    data: result[0]?.data,
    page: +currentPage,
    limit: +limit,
    total: result[0].total || 0,
  };
};

const updateOrder = (orderNo, payload) => {
  const { number, ...rest } = payload;
  return Model.findOneAndUpdate({ number: orderNo }, rest, { new: true });
};

const updateOrderStatus = async (orderNo) => {
  const order = await Model.findOne({ number: orderNo });
  const payload = {
    status: order?.status === "paid" ? "unpaid" : "paid",
  };
  return Model.findOneAndUpdate({ number: orderNo }, payload, { new: true });
};

const removeOrder = async (orderNo) => {
  const order = await Model.findOne({ number: orderNo });
  if (order.status === "paid")
    throw new Error(
      "Please change to refund status to complete the order deletion"
    );
  const orderedRooms = order?.rooms || [];
  orderedRooms.map(async (room) => {
    const isRoomAvailable = await roomModel.findOne({
      _id: room?.room,
    });
    if (!isRoomAvailable) throw new Error("Room is available");
    await roomModel.findOneAndUpdate(
      {
        _id: room?.room,
      },
      { status: "empty" },
      { new: true }
    );
  });
  return Model.deleteOne({ number: orderNo });
};

module.exports = {
  create,
  getByOrderNumber,
  list,
  updateOrder,
  updateOrderStatus,
  removeOrder,
};
