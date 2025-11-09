// Small storage helpers used across pages/components
export function readAllServices() {
  try {
    return JSON.parse(localStorage.getItem("services_by_user") || "{}");
  } catch {
    return {};
  }
}

export function writeAllServices(obj, notify = true) {
  localStorage.setItem("services_by_user", JSON.stringify(obj));
  try {
    // notify listeners in the same window unless suppressed
    if (notify) window.dispatchEvent(new Event("services-updated"));
  } catch {}
}

export function readLegacyServices() {
  try {
    return JSON.parse(localStorage.getItem("services") || "{}");
  } catch {
    return {};
  }
}
