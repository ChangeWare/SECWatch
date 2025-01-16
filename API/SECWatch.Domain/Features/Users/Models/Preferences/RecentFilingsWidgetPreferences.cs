namespace SECWatch.Domain.Features.Users.Models.Preferences;

public static class RecentFilingsWidgetPreferences
{
    public static UserPreference Default => new(
        new Dictionary<string, object>
            {
                { "numFilingsToShow", 10 },
                { "showTicker", true },
                { "showFilingType", true }
            }
        );
}