// Employer Handlers
export const approveEmployer = (employer, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from New Employers
    newData["New Employers"] = prev["New Employers"].filter((e) => e !== employer);
    // Add to Active Employers with status Active
    newData["Active Employers"] = [...prev["Active Employers"], { ...employer, status: "Active" }];
    return newData;
  });
};

export const rejectEmployer = (employer, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from New Employers
    newData["New Employers"] = prev["New Employers"].filter((e) => e !== employer);
    // Add to Rejected Employers with status Rejected
    newData["Rejected Employers"] = [...prev["Rejected Employers"], { ...employer, status: "Rejected" }];
    return newData;
  });
};

export const deactivateEmployer = (employer, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from Active Employers
    newData["Active Employers"] = prev["Active Employers"].filter((e) => e !== employer);
    // Add to Deactivated Employers with status Deactivated
    newData["Deactivated Employers"] = [...prev["Deactivated Employers"], { ...employer, status: "Deactivated" }];
    return newData;
  });
};

export const activateEmployer = (employer, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from Deactivated Employers
    newData["Deactivated Employers"] = prev["Deactivated Employers"].filter((e) => e !== employer);
    // Add back to Active Employers with status Active
    newData["Active Employers"] = [...prev["Active Employers"], { ...employer, status: "Active" }];
    return newData;
  });
};

// Job Post Handlers
export const approveJob = (job, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from New Job Posts
    newData["New Job Posts"] = prev["New Job Posts"].filter((j) => j !== job);
    // Add to Approved Job Posts with status Approved
    newData["Approved Job Posts"] = [...prev["Approved Job Posts"], { ...job, status: "Approved" }];
    return newData;
  });
};

export const rejectJob = (job, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from New Job Posts
    newData["New Job Posts"] = prev["New Job Posts"].filter((j) => j !== job);
    // Add to Rejected Job Posts with status Rejected
    newData["Rejected Job Posts"] = [...prev["Rejected Job Posts"], { ...job, status: "Rejected" }];
    return newData;
  });
};

export const makeAvailableJob = (job, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from Approved Job Posts
    newData["Approved Job Posts"] = prev["Approved Job Posts"].filter((j) => j !== job);
    // Add to Available Jobs with status Available
    newData["Available Jobs"] = [...prev["Available Jobs"], { ...job, status: "Available" }];
    return newData;
  });
};

export const removeJob = (job, setData) => {
  setData((prev) => {
    const newData = { ...prev };
    // Remove from Available Jobs or Approved Job Posts
    newData["Available Jobs"] = prev["Available Jobs"].filter((j) => j !== job);
    newData["Approved Job Posts"] = prev["Approved Job Posts"].filter((j) => j !== job);
    // Add to Removed Jobs with status Removed
    newData["Removed Jobs"] = [...prev["Removed Jobs"], { ...job, status: "Removed" }];
    return newData;
  });
};
