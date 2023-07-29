export function checkIdSelect(companyId, projectId) {
  if (!companyId)
    return {
      error: {
        title: "Warning",
        description: "Please, Check your select company !",
        status: "warning",
      },
      success: false,
    };

  if (!projectId)
    return {
      error: {
        title: "Warning",
        description: "Please, Check your select project !",
        status: "warning",
      },
      success: false,
    };

  return {
    success: true,
    error: null,
  };
}
