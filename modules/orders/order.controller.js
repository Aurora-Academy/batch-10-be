const Model = require("./order.model");

const create = (payload) => {
  const { updated_by, ...rest } = payload;
  rest.created_by = updated_by;
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
        isBlocked: filter?.status,
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
      $lookup: {
        from: "rooms",
        localField: "room",
        foreignField: "_id",
        as: "room",
      },
    },
    {
      $unwind: {
        path: "$room",
        preserveNullAndEmptyArrays: false,
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
