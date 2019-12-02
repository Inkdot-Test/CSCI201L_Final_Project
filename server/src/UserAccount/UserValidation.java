package UserAccount;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import entity.Credential;
import entity.JsonResponse;
import repositories.DatabaseManager;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/api/login")
public class UserValidation extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		HttpSession session = request.getSession();
		
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		if(username.trim().isEmpty())
		{
			response.getWriter().append(new JsonResponse("error", "Username cannot be blank.").toJson());
			return;
		}
		
		if(password.trim().isEmpty())
		{
			response.getWriter().append(new JsonResponse("error", "Password cannot be blank.").toJson());
			return;
		}
		
		boolean ValidUser = DatabaseManager.validateUsername(username);
		
		if(ValidUser)
		{
			Credential cr = DatabaseManager.getHashAndSalt(username);
			boolean Validpassword = cr.getHash().equals(Util.sha256Digest(password + cr.getSalt()));
			
			if(Validpassword)
			{
				response.getWriter().append(new JsonResponse("ok", null).toJson());
				session.setAttribute("username", username);
				return;
			}
		}
		response.getWriter().append(new JsonResponse("error", "Username and password does not match").toJson());
	}
}
















