import io
import base64
import matplotlib.pyplot as plt
import fastf1
import fastf1.plotting

def plot_position_changes_base64(year: int, round_num: int) -> str:
    """
    Generate the position-change plot for given year and round.
    Returns PNG image as a base64-encoded string.
    """
    # configure plotting (safe to call each time)
    fastf1.plotting.setup_mpl(mpl_timedelta_support=False, color_scheme='fastf1')

    # load session data (this can take time; it's done when the function is called, not at import)
    session = fastf1.get_session(year, round_num, 'R')
    session.load(telemetry=False, weather=False)

    fig, ax = plt.subplots(figsize=(8.0, 4.9))

    for drv in session.drivers:
        drv_laps = session.laps.pick_drivers(drv)
        if drv_laps.empty:
            continue
        abb = drv_laps['Driver'].iloc[0]
        style = fastf1.plotting.get_driver_style(identifier=abb,
                                                 style=['color', 'linestyle'],
                                                 session=session)
        ax.plot(drv_laps['LapNumber'], drv_laps['Position'],
                label=abb, **style)

    ax.set_ylim([20.5, 0.5])
    ax.set_yticks([1, 5, 10, 15, 20])
    ax.set_xlabel('Lap')
    ax.set_ylabel('Position')
    ax.legend(bbox_to_anchor=(1.0, 1.02))
    plt.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=150)
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('ascii')