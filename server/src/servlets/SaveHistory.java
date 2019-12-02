package servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import entity.BroadcastResponse;
import repositories.DatabaseManager;

/**
 * Servlet implementation class SaveHistory
 */
@WebServlet("/SaveHistory")
public class SaveHistory extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SaveHistory() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = (String)request.getAttribute("username");
		if(username == null)
		{
			BroadcastResponse res = new BroadcastResponse("error", "not logged in");
			response.getWriter().print(res.toJson());
		}
		else
		{
			response.getWriter().print(DatabaseManager.addSchedule(username, , false).toJson());
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
