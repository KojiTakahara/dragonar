package dragonar;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.IOException;
import javax.servlet.http.*;

public class GenerateDMSheet extends HttpServlet {

    private static final int LEFT = 80;
    private static final int RIGHT = 350;
    private static final int START_MAIN = 655;
    private static final int START_HYPER = 135;

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        response.setHeader("Access-Control-Allow-Origin", "*");

        // validate
        if (!validate(request)) {
            setBadRequestResponse(response);
            return;
        }

        String[] mainDeck = request.getParameter("mainDeck").split(",");
        String[] hyperSpatial = request.getParameter("hyperSpatial").split(",");

        try {
            PdfReader reader = new PdfReader("decksheet.pdf");
            PdfStamper pdfStamper = new PdfStamper(reader, response.getOutputStream());

            BaseFont bf = BaseFont.createFont("HeiseiKakuGo-W5", "UniJIS-UCS2-H", BaseFont.NOT_EMBEDDED);

            PdfContentByte over = pdfStamper.getOverContent(1);
            over.beginText();

            writeMainDeck(over, bf, mainDeck);
            writeHyperSpatial(over, bf, hyperSpatial);

            over.endText();
            pdfStamper.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        response.setContentType("application/pdf");
    }

    private void setBadRequestResponse(HttpServletResponse response) throws IOException {
        response.getWriter().println("bad request");
        response.setContentType("application/json");
        response.setStatus(400);
    }

    private void writeMainDeck(PdfContentByte over, BaseFont bf, String[] mainDeck) {
        int x = LEFT;
        int y = START_MAIN;
        for (int i = 0; i < mainDeck.length; i++) {
            if (20 <= i) {
                x = RIGHT;
            }
            if (20 == i) {
                y = START_MAIN;
            }
            writeText(over, bf, mainDeck[i], x, y);
            y -= 22.5;
        }
    }

    private void writeHyperSpatial(PdfContentByte over, BaseFont bf, String[] hyperSpatial) {
        int x = LEFT;
        int y = START_HYPER;
        for (int i = 0; i < hyperSpatial.length; i++) {
            if (4 <= i) {
                x = RIGHT;
            }
            if (4 == i) {
                y = START_HYPER;
            }
            writeText(over, bf, hyperSpatial[i], x, y);
            y -= 22.5;
        }
    }

    private void writeText(PdfContentByte over, BaseFont bf, String text, int x, int y) {
        over.setFontAndSize(bf, getFontSize(text));
        over.showTextAligned(Element.ALIGN_TOP, text, x, y, 0);
    }

    private int getFontSize(String text) {
        int length = text.length();
        if (24 < length) {
            return 8;
        }
        if (17 < length) {
            return 10;
        }
        return 12;
    }

    private boolean validate(HttpServletRequest request) {
        String mainDeckStr = request.getParameter("mainDeck");
        String hyperSpatialStr = request.getParameter("hyperSpatial");
        String playerName = request.getParameter("playerName");
        if (mainDeckStr == null || mainDeckStr == "" || playerName == null || playerName == "") {
            return false;
        }
        String[] mainDeck = mainDeckStr.split(",");
        String[] hyperSpatial = hyperSpatialStr.split(",");
        if (mainDeck.length != 40) {
            return false;
        }
        if (8 < hyperSpatial.length) {
            return false;
        }
        return true;
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        resp.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    }

}
