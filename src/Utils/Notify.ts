import { enqueueSnackbar } from "notistack";

class Notify {

    /**
     * Private helper to extract the most relevant error message 
     * from various error object structures (API, JS errors, or strings).
     */
    private extractErrorMessage(err: any): string {
        if (typeof err === "string") return err;
        if (err?.response?.data?.error) return err.response.data.error; // API specific error
        if (err?.message) return err.message; // Standard JS error
        return "An unexpected error occurred";
    }

    /**
     * Display a red "error" snackbar for API failures or critical issues.
     */
    public error(err: any): void {
        const message = this.extractErrorMessage(err);
        enqueueSnackbar(message, { 
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "left" }
        });
    }

    /**
    * Generic warning notification for application-wide alerts.
    * Can be used for validation messages or business logic constraints.
    */
    public warning(message: string): void {
        enqueueSnackbar(message, { 
            variant: "warning",
            anchorOrigin: { vertical: "top", horizontal: "left" }
        });
    }
}

export const notify = new Notify();