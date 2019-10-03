package de.hsfulda.et.wbs.http.resource;

import de.hsfulda.et.wbs.action.transaktion.AddTransaktionAction;
import de.hsfulda.et.wbs.action.transaktion.GetTransaktionListAction;
import de.hsfulda.et.wbs.core.HalJsonResource;
import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.core.data.TransaktionData;
import de.hsfulda.et.wbs.http.haljson.TransaktionListHalJson;
import de.hsfulda.et.wbs.http.resource.dto.TransaktionDtoImpl;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import static de.hsfulda.et.wbs.Application.CONTEXT_ROOT;
import static de.hsfulda.et.wbs.core.HalJsonResource.HAL_JSON;
import static de.hsfulda.et.wbs.util.HeaderUtil.locationHeader;

/**
 * Über diese Resource können bereits erstellte Transaktionen angezeigt und neue Transaktionen hinzugefügt
 * werden.
 */
@RestController
@RequestMapping(TransaktionListResource.PATH)
public class TransaktionListResource {

    private final GetTransaktionListAction getAction;
    private final AddTransaktionAction postAction;

    public static final String PATH = CONTEXT_ROOT + "/transaktion";

    public TransaktionListResource(GetTransaktionListAction getAction, AddTransaktionAction postAction) {
        this.getAction = getAction;
        this.postAction = postAction;
    }

    /**
     * Ermittelt Transaktionen der letzten 5 Tage für den angemeldeten Benutzer.
     *
     * @return gefundenen Träger. Anderfalls 404
     */
    @GetMapping(produces = HAL_JSON)
    @PreAuthorize("hasAuthority('READ_ALL')")
    HttpEntity<HalJsonResource> get(@AuthenticationPrincipal WbsUser user) {
        return new HttpEntity<>(new TransaktionListHalJson(user, getAction.perform(user)));
    }

    /**
     * Erstellt eine Transaktion im System.
     *
     * @param transaktion Neue Transaktion.
     * @return Erstellte Transaktion.
     */
    @PostMapping(produces = HAL_JSON)
    @PreAuthorize("hasAuthority('ACCOUNTANT')")
    HttpEntity<HalJsonResource> post(@AuthenticationPrincipal WbsUser user,
            @RequestBody TransaktionDtoImpl transaktion) {
        TransaktionData newTransaktion = postAction.perform(user, transaktion);
        MultiValueMap<String, String> header = locationHeader(TransaktionResource.PATH, newTransaktion.getId());
        return new ResponseEntity<>(header, HttpStatus.CREATED);
    }
}
